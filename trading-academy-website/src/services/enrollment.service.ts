import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { Enrollment } from "@/models/Enrollment";
import { Course } from "@/models/Course";
import { User } from "@/models/User";
import { Lecture } from "@/models/Lecture";
import { recordAuditLog } from "./audit.service";
import { ApiError } from "@/lib/errors";
import { ENROLLMENT_STATUS, LECTURE_STATUS, ROLES, ERROR_CODES } from "@/lib/constants";
import {
  EnrollStudentInput,
  UpdateEnrollmentInput,
  EnrollmentQueryInput,
} from "@/lib/validators/enrollment";
import { ICourse, ILecture, IModule, IEnrollment } from "@/types/lms";

/**
 * Technical Specification Section 4.4 & 6.7:
 * Effective access = status === 'active' AND startsAt <= now AND (expiresAt is null OR expiresAt > now)
 */
export function hasAccess(
  e: { status: string; startsAt: Date | string; expiresAt?: Date | string | null },
  now = new Date()
): boolean {
  if (e.status !== ENROLLMENT_STATUS.ACTIVE) return false;
  const start = new Date(e.startsAt);
  if (start > now) return false;
  if (e.expiresAt) {
    const end = new Date(e.expiresAt);
    if (end <= now) return false;
  }
  return true;
}

/**
 * Enrolls a student into a course with capacity checks and drip defaults.
 */
export async function enrollStudent(
  courseId: string,
  input: EnrollStudentInput,
  actorId: string,
  ip = "127.0.0.1",
  source: "admin" | "import" = "admin"
) {
  await connectToDatabase();

  const [course, student] = await Promise.all([
    Course.findOne({ _id: courseId, deletedAt: null }),
    User.findOne({ _id: input.studentId, role: ROLES.STUDENT, deletedAt: null }),
  ]);

  if (!course) {
    throw ApiError.notFound("Course not found");
  }
  if (!student) {
    throw ApiError.notFound("Student not found");
  }

  // Capacity check per spec 6.7
  if (course.settings?.maxStudents && course.settings.maxStudents > 0) {
    const activeCount = await Enrollment.countDocuments({
      courseId,
      status: ENROLLMENT_STATUS.ACTIVE,
    });
    if (activeCount >= course.settings.maxStudents) {
      throw ApiError.conflict(
        `Course capacity reached (${course.settings.maxStudents} max students)`,
        ERROR_CODES.CONFLICT
      );
    }
  }

  // Determine expiration date
  let expiresAt: Date | null = null;
  if (input.expiresAt !== undefined) {
    expiresAt = input.expiresAt ? new Date(input.expiresAt) : null;
  } else if (course.settings?.accessDays && course.settings.accessDays > 0) {
    expiresAt = new Date(Date.now() + course.settings.accessDays * 86400000);
  }

  const startsAt = input.startsAt ? new Date(input.startsAt) : new Date();

  // Count published lectures for progress snapshot
  const publishedLecturesCount = await Lecture.countDocuments({
    courseId,
    status: LECTURE_STATUS.PUBLISHED,
    deletedAt: null,
  });

  // Check if enrollment already exists
  const existing = await Enrollment.findOne({ courseId, studentId: input.studentId });

  let enrollment;
  if (existing) {
    if (existing.status === ENROLLMENT_STATUS.ACTIVE) {
      throw ApiError.conflict(
        "Student is already actively enrolled in this course",
        ERROR_CODES.CONFLICT
      );
    }

    // Reactivate previous enrollment
    const prevStatus = existing.status;
    existing.status = ENROLLMENT_STATUS.ACTIVE;
    existing.startsAt = startsAt;
    existing.expiresAt = expiresAt;
    existing.source = source;
    existing.grantedBy = new mongoose.Types.ObjectId(actorId);
    existing.note = input.note || existing.note;
    existing.revokedAt = null;
    existing.revokeReason = "";
    existing.progress.totalLectures = publishedLecturesCount;
    await existing.save();
    enrollment = existing;

    if ((prevStatus as string) !== ENROLLMENT_STATUS.ACTIVE) {
      await Course.findByIdAndUpdate(courseId, { $inc: { "stats.enrolledCount": 1 } });
    }
  } else {
    // Create new enrollment
    enrollment = await Enrollment.create({
      courseId,
      studentId: input.studentId,
      status: ENROLLMENT_STATUS.ACTIVE,
      startsAt,
      expiresAt,
      source,
      grantedBy: actorId,
      note: input.note || "",
      progress: {
        completedLectures: 0,
        totalLectures: publishedLecturesCount,
        percent: 0,
      },
    });

    await Course.findByIdAndUpdate(courseId, { $inc: { "stats.enrolledCount": 1 } });
  }

  await recordAuditLog({
    actorId,
    action: "enrollment_granted",
    entityType: "enrollment",
    entityId: (enrollment._id as mongoose.Types.ObjectId).toString(),
    summary: `Enrolled student ${student.name} (${student.studentCode || student.email}) into course "${course.title}"`,
    ip,
    after: {
      courseId,
      studentId: input.studentId,
      startsAt,
      expiresAt,
    },
  });

  return enrollment;
}

/**
 * Batch enrolls multiple students into a course.
 */
export async function batchEnrollStudents(
  courseId: string,
  studentIds: string[],
  options: { startsAt?: Date; expiresAt?: Date | null; note?: string },
  actorId: string,
  ip = "127.0.0.1"
) {
  const results = {
    enrolled: 0,
    skipped: 0,
    errors: [] as { studentId: string; message: string }[],
  };

  for (const studentId of studentIds) {
    try {
      await enrollStudent(
        courseId,
        {
          studentId,
          startsAt: options.startsAt,
          expiresAt: options.expiresAt,
          note: options.note,
        },
        actorId,
        ip
      );
      results.enrolled++;
    } catch (err: unknown) {
      const msg = err instanceof ApiError ? err.message : "Failed to enroll";
      results.errors.push({ studentId, message: msg });
      results.skipped++;
    }
  }

  return results;
}

/**
 * Revokes an existing enrollment.
 */
export async function revokeEnrollment(
  enrollmentId: string,
  reason: string,
  actorId: string,
  ip = "127.0.0.1"
) {
  await connectToDatabase();

  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw ApiError.notFound("Enrollment not found");
  }

  if (enrollment.status === ENROLLMENT_STATUS.REVOKED) {
    return enrollment;
  }

  const prevStatus = enrollment.status;
  enrollment.status = ENROLLMENT_STATUS.REVOKED;
  enrollment.revokedAt = new Date();
  enrollment.revokeReason = reason;
  await enrollment.save();

  if (prevStatus === ENROLLMENT_STATUS.ACTIVE) {
    await Course.findByIdAndUpdate(enrollment.courseId, {
      $inc: { "stats.enrolledCount": -1 },
    });
  }

  await recordAuditLog({
    actorId,
    action: "enrollment_revoked",
    entityType: "enrollment",
    entityId: enrollmentId,
    summary: `Revoked enrollment for student ${enrollment.studentId} in course ${enrollment.courseId}. Reason: ${reason}`,
    ip,
    before: { status: prevStatus },
    after: { status: ENROLLMENT_STATUS.REVOKED, revokeReason: reason },
  });

  return enrollment;
}

/**
 * Updates enrollment dates or status (e.g. extending access or manual reactivation).
 */
export async function updateEnrollment(
  enrollmentId: string,
  data: UpdateEnrollmentInput,
  actorId: string,
  ip = "127.0.0.1"
) {
  await connectToDatabase();

  const enrollment = await Enrollment.findById(enrollmentId);
  if (!enrollment) {
    throw ApiError.notFound("Enrollment not found");
  }

  const prevStatus = enrollment.status;
  const beforeDiff: Record<string, unknown> = {
    status: enrollment.status,
    startsAt: enrollment.startsAt,
    expiresAt: enrollment.expiresAt,
  };

  if (data.status) {
    enrollment.status = data.status;
    if (data.status === ENROLLMENT_STATUS.ACTIVE) {
      enrollment.revokedAt = null;
      enrollment.revokeReason = "";
    }
  }

  if (data.startsAt !== undefined) {
    enrollment.startsAt = new Date(data.startsAt);
  }

  if (data.expiresAt !== undefined) {
    enrollment.expiresAt = data.expiresAt ? new Date(data.expiresAt) : null;
    // Auto reactivate if it was expired and the new expiration is in the future
    if (
      enrollment.status === ENROLLMENT_STATUS.EXPIRED &&
      (!enrollment.expiresAt || enrollment.expiresAt > new Date())
    ) {
      enrollment.status = ENROLLMENT_STATUS.ACTIVE;
    }
  }

  if (data.note !== undefined) {
    enrollment.note = data.note;
  }

  await enrollment.save();

  // Adjust course enrolled count if active state changed
  if (prevStatus !== ENROLLMENT_STATUS.ACTIVE && enrollment.status === ENROLLMENT_STATUS.ACTIVE) {
    await Course.findByIdAndUpdate(enrollment.courseId, { $inc: { "stats.enrolledCount": 1 } });
  } else if (
    prevStatus === ENROLLMENT_STATUS.ACTIVE &&
    enrollment.status !== ENROLLMENT_STATUS.ACTIVE
  ) {
    await Course.findByIdAndUpdate(enrollment.courseId, { $inc: { "stats.enrolledCount": -1 } });
  }

  await recordAuditLog({
    actorId,
    action: "enrollment_updated",
    entityType: "enrollment",
    entityId: enrollmentId,
    summary: `Updated enrollment for student ${enrollment.studentId} in course ${enrollment.courseId}`,
    ip,
    before: beforeDiff,
    after: {
      status: enrollment.status,
      startsAt: enrollment.startsAt,
      expiresAt: enrollment.expiresAt,
    },
  });

  return enrollment;
}

/**
 * Gets paginated list of students enrolled in a specific course.
 */
export async function getCourseEnrollments(
  courseId: string,
  query: EnrollmentQueryInput
) {
  await connectToDatabase();

  const filter: Record<string, unknown> = { courseId };
  if (query.status) {
    filter.status = query.status;
  }

  const page = Math.max(1, query.page || 1);
  const limit = Math.min(100, Math.max(1, query.limit || 20));
  const skip = (page - 1) * limit;

  // If search query is provided, find matching student IDs first
  const search = query.search || query.q;
  if (search?.trim()) {
    const searchRegex = new RegExp(search.trim(), "i");
    const matchingStudents = await User.find({
      role: ROLES.STUDENT,
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { studentCode: searchRegex },
        { phone: searchRegex },
      ],
    })
      .select("_id")
      .lean();

    filter.studentId = { $in: matchingStudents.map((s) => s._id) };
  }

  const [enrollments, total] = await Promise.all([
    Enrollment.find(filter)
      .populate("studentId", "name email studentCode phone avatar status")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Enrollment.countDocuments(filter),
  ]);

  return {
    enrollments,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}

/**
 * Gets all enrollments for a specific student.
 */
export async function getStudentEnrollments(
  studentId: string,
  query?: { status?: string }
) {
  await connectToDatabase();

  const filter: Record<string, unknown> = { studentId };
  if (query?.status) {
    filter.status = query.status;
  }

  const enrollments = await Enrollment.find(filter)
    .populate("courseId", "title slug thumbnail difficulty stats status categoryIds")
    .sort({ createdAt: -1 })
    .lean();

  return enrollments;
}

/**
 * Cron task: Marks all overdue active enrollments as expired.
 */
export async function expireOverdueEnrollments() {
  await connectToDatabase();

  const now = new Date();
  const result = await Enrollment.updateMany(
    {
      status: ENROLLMENT_STATUS.ACTIVE,
      expiresAt: { $ne: null, $lte: now },
    },
    {
      $set: { status: ENROLLMENT_STATUS.EXPIRED },
    }
  );

  return {
    expiredCount: result.modifiedCount,
    timestamp: now.toISOString(),
  };
}

/**
 * Technical Specification Section 6.7: Drip Rule Evaluation
 */
export function isLectureUnlocked({
  courseSettings,
  lecture,
  module,
  enrollment,
  completedLectureIds = new Set<string>(),
  allOrderedLectures = [],
  now = new Date(),
}: {
  courseSettings: ICourse["settings"];
  lecture: ILecture;
  module?: IModule | null;
  enrollment: IEnrollment;
  completedLectureIds?: Set<string>;
  allOrderedLectures?: ILecture[];
  now?: Date;
}): { unlocked: boolean; reason?: string; unlockDate?: Date } {
  // If enrollment is not effectively active, everything is locked
  if (!hasAccess(enrollment, now)) {
    return { unlocked: false, reason: "Enrollment expired or inactive" };
  }

  // Module level fixedDate unlock
  if (module?.drip?.unlockAt) {
    const unlockDate = new Date(module.drip.unlockAt);
    if (now < unlockDate) {
      return {
        unlocked: false,
        reason: `Unlocks on ${unlockDate.toLocaleDateString()}`,
        unlockDate,
      };
    }
  }

  const mode = courseSettings?.drip?.mode || "none";

  if (mode === "none") {
    return { unlocked: true };
  }

  if (mode === "daysAfterEnroll") {
    const days = lecture.drip?.unlockAfterDays || 0;
    const unlockDate = new Date(new Date(enrollment.startsAt).getTime() + days * 86400000);
    if (now < unlockDate) {
      return {
        unlocked: false,
        reason: `Unlocks ${days} days after enrollment (${unlockDate.toLocaleDateString()})`,
        unlockDate,
      };
    }
    return { unlocked: true };
  }

  if (mode === "sequential") {
    const currentIndex = allOrderedLectures.findIndex(
      (l) => l._id.toString() === lecture._id.toString()
    );

    // If first lecture, always unlocked
    if (currentIndex <= 0) {
      return { unlocked: true };
    }

    const previousLecture = allOrderedLectures[currentIndex - 1];
    if (completedLectureIds.has(previousLecture._id.toString())) {
      return { unlocked: true };
    }

    return {
      unlocked: false,
      reason: `Complete "${previousLecture.title}" to unlock this lecture`,
    };
  }

  return { unlocked: true };
}
