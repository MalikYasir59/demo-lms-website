import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { LectureProgress } from "@/models/LectureProgress";
import { Enrollment } from "@/models/Enrollment";
import { Course } from "@/models/Course";
import { Module } from "@/models/Module";
import { Lecture } from "@/models/Lecture";
import { User } from "@/models/User";
import { ApiError } from "@/lib/errors";
import {
  ENROLLMENT_STATUS,
  LECTURE_STATUS,
  MODULE_STATUS,
  PROGRESS_STATUS,
  COURSE_STATUS,
  ERROR_CODES,
} from "@/lib/constants";
import { hasAccess, isLectureUnlocked } from "./enrollment.service";
import { ICourse, ILecture, IModule, IEnrollment, ILectureProgress } from "@/types/lms";

/**
 * Interval merging algorithm to accurately calculate unique seconds watched.
 * Handles duplicate playback, seeking back and forth, and overlapping ranges.
 */
export function mergeWatchedRanges(
  existingRanges: [number, number][],
  newRange: [number, number]
): { ranges: [number, number][]; uniqueWatchedSec: number } {
  const start = Math.min(newRange[0], newRange[1]);
  const end = Math.max(newRange[0], newRange[1]);

  if (start === end || start < 0) {
    const unique = Math.round(
      existingRanges.reduce((acc, [s, e]) => acc + Math.max(0, e - s), 0)
    );
    return { ranges: existingRanges, uniqueWatchedSec: unique };
  }

  const all = [...existingRanges, [start, end] as [number, number]]
    .filter(([s, e]) => e > s)
    .sort((a, b) => a[0] - b[0]);

  const merged: [number, number][] = [];
  for (const r of all) {
    if (merged.length === 0) {
      merged.push([r[0], r[1]]);
    } else {
      const last = merged[merged.length - 1];
      if (r[0] <= last[1]) {
        last[1] = Math.max(last[1], r[1]);
      } else {
        merged.push([r[0], r[1]]);
      }
    }
  }

  const uniqueWatchedSec = Math.round(
    merged.reduce((acc, [s, e]) => acc + (e - s), 0)
  );

  return { ranges: merged, uniqueWatchedSec };
}

/**
 * Records telemetry heartbeat from playback session and updates progress.
 */
export async function recordLectureProgress({
  studentId,
  lectureId,
  from,
  pos,
  durationSec,
}: {
  studentId: string;
  lectureId: string;
  from: number;
  pos: number;
  durationSec?: number;
}) {
  await connectToDatabase();

  const lecture = await Lecture.findOne({
    _id: lectureId,
    deletedAt: null,
  });
  if (!lecture) {
    throw ApiError.notFound("Lecture not found");
  }

  const course = await Course.findOne({
    _id: lecture.courseId,
    deletedAt: null,
  });
  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  // Effective enrollment check
  const enrollment = await Enrollment.findOne({
    studentId,
    courseId: lecture.courseId,
  });
  if (!enrollment || !hasAccess(enrollment)) {
    throw ApiError.forbidden("No active enrollment for this course");
  }

  const duration = durationSec || lecture.video?.durationSec || 1;
  const watchDelta = Math.abs(pos - from);

  let progress = await LectureProgress.findOne({ studentId, lectureId });

  if (!progress) {
    const { ranges, uniqueWatchedSec } = mergeWatchedRanges([], [from, pos]);
    const percent = Math.min(100, Math.round((uniqueWatchedSec / duration) * 100));
    const completionThreshold = course.settings?.completionThreshold || 90;
    const isCompleted = percent >= completionThreshold;

    progress = await LectureProgress.create({
      studentId,
      courseId: lecture.courseId,
      moduleId: lecture.moduleId,
      lectureId,
      status: isCompleted ? PROGRESS_STATUS.COMPLETED : PROGRESS_STATUS.IN_PROGRESS,
      lastPositionSec: pos,
      durationSec: duration,
      watchedRanges: ranges,
      uniqueWatchedSec,
      percent,
      totalWatchSec: watchDelta,
      playCount: 1,
      firstWatchedAt: new Date(),
      lastWatchedAt: new Date(),
      completedAt: isCompleted ? new Date() : null,
    });
  } else {
    const prevRanges = progress.watchedRanges as [number, number][];
    const { ranges, uniqueWatchedSec } = mergeWatchedRanges(prevRanges, [from, pos]);
    const percent = Math.min(100, Math.round((uniqueWatchedSec / duration) * 100));
    const completionThreshold = course.settings?.completionThreshold || 90;
    const isCompleted =
      progress.status === PROGRESS_STATUS.COMPLETED || percent >= completionThreshold;

    progress.watchedRanges = ranges;
    progress.uniqueWatchedSec = uniqueWatchedSec;
    progress.percent = Math.max(progress.percent, percent);
    progress.lastPositionSec = pos;
    progress.totalWatchSec += watchDelta;
    progress.lastWatchedAt = new Date();

    if (isCompleted && progress.status !== PROGRESS_STATUS.COMPLETED) {
      progress.status = PROGRESS_STATUS.COMPLETED;
      progress.completedAt = new Date();
    }

    await progress.save();
  }

  // Update Enrollment progress
  const [completedCount, totalLecturesCount] = await Promise.all([
    LectureProgress.countDocuments({
      studentId,
      courseId: lecture.courseId,
      status: PROGRESS_STATUS.COMPLETED,
    }),
    Lecture.countDocuments({
      courseId: lecture.courseId,
      status: LECTURE_STATUS.PUBLISHED,
      deletedAt: null,
    }),
  ]);

  const coursePercent =
    totalLecturesCount > 0 ? Math.round((completedCount / totalLecturesCount) * 100) : 0;

  enrollment.progress.completedLectures = completedCount;
  enrollment.progress.totalLectures = totalLecturesCount;
  enrollment.progress.percent = coursePercent;
  enrollment.progress.lastLectureId = new mongoose.Types.ObjectId(lectureId);
  enrollment.progress.lastActivityAt = new Date();

  if (coursePercent >= 100 && !enrollment.completedAt) {
    enrollment.completedAt = new Date();
  }

  await enrollment.save();

  return {
    progress,
    coursePercent,
    isLectureCompleted: progress.status === PROGRESS_STATUS.COMPLETED,
  };
}

/**
 * Returns dashboard telemetry for the authenticated student.
 */
export async function getStudentDashboardData(studentId: string) {
  await connectToDatabase();

  const enrollments = await Enrollment.find({
    studentId,
    status: ENROLLMENT_STATUS.ACTIVE,
  })
    .populate({
      path: "courseId",
      select: "title slug subtitle thumbnail difficulty stats status categoryIds authorId",
      populate: [
        { path: "categoryIds", select: "name color" },
        { path: "authorId", select: "name title avatar" },
      ],
    })
    .sort({ "progress.lastActivityAt": -1, createdAt: -1 })
    .lean();

  // Filter only effectively active enrollments
  const now = new Date();
  const activeEnrollments = enrollments.filter((e) => hasAccess(e, now));

  // Compute aggregate stats
  const totalCourses = activeEnrollments.length;
  let totalLecturesCompleted = 0;
  for (const e of activeEnrollments) {
    totalLecturesCompleted += e.progress?.completedLectures || 0;
  }

  const allProgress = await LectureProgress.find({ studentId }).select("uniqueWatchedSec").lean();
  const totalWatchedSeconds = allProgress.reduce(
    (acc, p) => acc + (p.uniqueWatchedSec || 0),
    0
  );
  const totalWatchedHours = (totalWatchedSeconds / 3600).toFixed(1);

  // Compute "Continue Learning" target per Spec 6.7
  let continueTarget: {
    courseId: string;
    courseTitle: string;
    courseSlug: string;
    lectureId: string;
    lectureTitle: string;
    resumeAtSec: number;
    durationSec: number;
  } | null = null;

  for (const enrollment of activeEnrollments) {
    const course = enrollment.courseId as unknown as ICourse;
    if (!course || course.status !== COURSE_STATUS.PUBLISHED) continue;

    // Fetch ordered published modules & lectures for this course
    const modules = await Module.find({
      courseId: course._id,
      status: MODULE_STATUS.PUBLISHED,
      deletedAt: null,
    })
      .sort({ order: 1 })
      .lean();

    const moduleIds = modules.map((m) => m._id);
    const lectures = await Lecture.find({
      moduleId: { $in: moduleIds },
      status: LECTURE_STATUS.PUBLISHED,
      deletedAt: null,
    })
      .sort({ order: 1 })
      .select("_id title durationSec moduleId")
      .lean();

    if (lectures.length === 0) continue;

    const progressList = await LectureProgress.find({
      studentId,
      courseId: course._id,
    }).lean();

    const progressMap = new Map(progressList.map((p) => [p.lectureId.toString(), p]));

    // Find first incomplete lecture or last incomplete
    let targetLecture = lectures[0];
    if (enrollment.progress?.lastLectureId) {
      const lastProg = progressMap.get(enrollment.progress.lastLectureId.toString());
      if (lastProg && lastProg.status !== PROGRESS_STATUS.COMPLETED) {
        const found = lectures.find(
          (l) => l._id.toString() === enrollment.progress.lastLectureId!.toString()
        );
        if (found) targetLecture = found;
      } else {
        // Find next incomplete
        const nextIncomplete = lectures.find((l) => {
          const p = progressMap.get(l._id.toString());
          return !p || p.status !== PROGRESS_STATUS.COMPLETED;
        });
        if (nextIncomplete) targetLecture = nextIncomplete;
      }
    }

    const targetProg = progressMap.get(targetLecture._id.toString());

    continueTarget = {
      courseId: course._id.toString(),
      courseTitle: course.title,
      courseSlug: course.slug,
      lectureId: targetLecture._id.toString(),
      lectureTitle: targetLecture.title,
      resumeAtSec: targetProg?.lastPositionSec || 0,
      durationSec: targetProg?.durationSec || targetLecture.video?.durationSec || 0,
    };
    break;
  }

  // Check for upcoming expirations (within 7 days)
  const sevenDaysFromNow = new Date(Date.now() + 7 * 86400000);
  const expiringSoon = activeEnrollments
    .filter((e) => e.expiresAt && new Date(e.expiresAt) <= sevenDaysFromNow)
    .map((e) => ({
      courseTitle: (e.courseId as unknown as ICourse)?.title,
      expiresAt: e.expiresAt,
    }));

  return {
    stats: {
      enrolledCoursesCount: totalCourses,
      lecturesCompletedCount: totalLecturesCompleted,
      totalHoursWatched: totalWatchedHours,
    },
    continueTarget,
    courses: activeEnrollments,
    expiringSoon,
  };
}

/**
 * Returns full course syllabus tree for the student with locked/unlocked statuses.
 * NEVER returns video ref or sensitive playback keys.
 */
export async function getStudentCourseDetail(studentId: string, courseId: string) {
  await connectToDatabase();

  const enrollment = await Enrollment.findOne({
    studentId,
    courseId,
  });

  if (!enrollment || !hasAccess(enrollment)) {
    throw ApiError.forbidden(
      "You do not have an active enrollment for this course",
      ERROR_CODES.NOT_ENROLLED
    );
  }

  const course = await Course.findOne({
    _id: courseId,
    status: COURSE_STATUS.PUBLISHED,
    deletedAt: null,
  })
    .populate("categoryIds", "name color slug")
    .populate("authorId", "name title avatar bio social")
    .lean();

  if (!course) {
    throw ApiError.notFound("Course not found or not published");
  }

  const modules = await Module.find({
    courseId,
    status: MODULE_STATUS.PUBLISHED,
    deletedAt: null,
  })
    .sort({ order: 1 })
    .lean();

  const moduleIds = modules.map((m) => m._id);

  // Strictly omit video.ref via select!
  const lectures = await Lecture.find({
    moduleId: { $in: moduleIds },
    status: LECTURE_STATUS.PUBLISHED,
    deletedAt: null,
  })
    .select("-video.ref")
    .sort({ order: 1 })
    .lean();

  const studentProgress = await LectureProgress.find({
    studentId,
    courseId,
  }).lean();

  const progressMap = new Map(studentProgress.map((p) => [p.lectureId.toString(), p]));
  const completedLectureIds = new Set(
    studentProgress
      .filter((p) => p.status === PROGRESS_STATUS.COMPLETED)
      .map((p) => p.lectureId.toString())
  );

  // Group lectures by module and evaluate drip lock state
  const modulesWithLectures = modules.map((mod) => {
    const modLectures = lectures.filter((l) => l.moduleId.toString() === mod._id.toString());

    const enrichedLectures = modLectures.map((lec) => {
      const prog = progressMap.get(lec._id.toString());
      const dripStatus = isLectureUnlocked({
        courseSettings: course.settings,
        lecture: lec as unknown as ILecture,
        module: mod as unknown as IModule,
        enrollment: enrollment as unknown as IEnrollment,
        completedLectureIds,
        allOrderedLectures: lectures as unknown as ILecture[],
      });

      return {
        _id: lec._id,
        title: lec.title,
        description: lec.description,
        order: lec.order,
        durationSec: lec.video?.durationSec || 0,
        resourcesCount: lec.resources?.length || 0,
        unlocked: dripStatus.unlocked,
        lockReason: dripStatus.reason || null,
        unlockDate: dripStatus.unlockDate || null,
        progress: prog
          ? {
              status: prog.status,
              percent: prog.percent,
              lastPositionSec: prog.lastPositionSec,
              completedAt: prog.completedAt,
            }
          : {
              status: PROGRESS_STATUS.IN_PROGRESS,
              percent: 0,
              lastPositionSec: 0,
              completedAt: null,
            },
      };
    });

    return {
      _id: mod._id,
      title: mod.title,
      description: mod.description,
      order: mod.order,
      lectures: enrichedLectures,
    };
  });

  return {
    course: {
      _id: course._id,
      title: course.title,
      slug: course.slug,
      subtitle: course.subtitle,
      description: course.description,
      thumbnail: course.thumbnail,
      difficulty: course.difficulty,
      language: course.language,
      learningOutcomes: course.learningOutcomes,
      requirements: course.requirements,
      audience: course.audience,
      categoryIds: course.categoryIds,
      authorId: course.authorId,
      stats: course.stats,
    },
    enrollment: {
      status: enrollment.status,
      startsAt: enrollment.startsAt,
      expiresAt: enrollment.expiresAt,
      progress: enrollment.progress,
    },
    modules: modulesWithLectures,
  };
}

/**
 * Returns lecture metadata and adjacent navigation for student view.
 * Strictly avoids returning raw video references.
 */
export async function getStudentLectureData(studentId: string, lectureId: string) {
  await connectToDatabase();

  const lecture = await Lecture.findOne({
    _id: lectureId,
    status: LECTURE_STATUS.PUBLISHED,
    deletedAt: null,
  })
    .select("-video.ref")
    .lean();

  if (!lecture) {
    throw ApiError.notFound("Lecture not found");
  }

  const enrollment = await Enrollment.findOne({
    studentId,
    courseId: lecture.courseId,
  });

  if (!enrollment || !hasAccess(enrollment)) {
    throw ApiError.forbidden("You do not have active enrollment for this course");
  }

  // Verify lecture is unlocked for student
  const [course, module, allLectures, studentProgress] = await Promise.all([
    Course.findById(lecture.courseId).lean(),
    Module.findById(lecture.moduleId).lean(),
    Lecture.find({
      courseId: lecture.courseId,
      status: LECTURE_STATUS.PUBLISHED,
      deletedAt: null,
    })
      .sort({ order: 1 })
      .select("_id title moduleId order")
      .lean(),
    LectureProgress.find({
      studentId,
      courseId: lecture.courseId,
    }).lean(),
  ]);

  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  const completedSet = new Set(
    studentProgress
      .filter((p) => p.status === PROGRESS_STATUS.COMPLETED)
      .map((p) => p.lectureId.toString())
  );

  const dripCheck = isLectureUnlocked({
    courseSettings: course.settings,
    lecture: lecture as unknown as ILecture,
    module: module as unknown as IModule,
    enrollment: enrollment as unknown as IEnrollment,
    completedLectureIds: completedSet,
    allOrderedLectures: allLectures as unknown as ILecture[],
  });

  if (!dripCheck.unlocked) {
    throw ApiError.forbidden(
      dripCheck.reason || "Lecture is locked",
      ERROR_CODES.LECTURE_LOCKED
    );
  }

  const currentIdx = allLectures.findIndex((l) => l._id.toString() === lectureId);
  const prevLecture = currentIdx > 0 ? allLectures[currentIdx - 1] : null;
  const nextLecture = currentIdx < allLectures.length - 1 ? allLectures[currentIdx + 1] : null;

  const progress = await LectureProgress.findOne({ studentId, lectureId }).lean();

  return {
    lecture: {
      _id: lecture._id,
      title: lecture.title,
      description: lecture.description,
      durationSec: lecture.video?.durationSec || 0,
      resources: lecture.resources || [],
    },
    navigation: {
      prev: prevLecture ? { id: prevLecture._id, title: prevLecture.title } : null,
      next: nextLecture ? { id: nextLecture._id, title: nextLecture.title } : null,
    },
    progress: progress
      ? {
          lastPositionSec: progress.lastPositionSec,
          percent: progress.percent,
          status: progress.status,
        }
      : {
          lastPositionSec: 0,
          percent: 0,
          status: PROGRESS_STATUS.IN_PROGRESS,
        },
  };
}
