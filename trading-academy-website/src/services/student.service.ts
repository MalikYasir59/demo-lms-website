import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { AuthSession } from "@/models/AuthSession";
import { recordAuditLog } from "./audit.service";
import { ApiError } from "@/lib/errors";
import {
  ROLES,
  USER_STATUS,
  REVOKED_REASONS,
  UserStatus,
  PAGINATION,
} from "@/lib/constants";
import {
  CreateStudentInput,
  UpdateStudentInput,
} from "@/lib/validators/student";

/**
 * Generates the next sequential student code in ITT-YY-XXXX format (e.g. ITT-26-0001).
 */
export async function generateNextStudentCode(): Promise<string> {
  await connectToDatabase();

  const currentYear = new Date().getFullYear().toString().slice(-2); // e.g. "26"
  const prefix = `ITT-${currentYear}-`;

  const latestStudent = await User.findOne({
    studentCode: new RegExp(`^${prefix}\\d{4}$`),
  })
    .sort({ studentCode: -1 })
    .select("studentCode")
    .lean();

  if (!latestStudent?.studentCode) {
    return `${prefix}0001`;
  }

  const currentSeq = parseInt(latestStudent.studentCode.replace(prefix, ""), 10);
  const nextSeq = isNaN(currentSeq) ? 1 : currentSeq + 1;
  return `${prefix}${nextSeq.toString().padStart(4, "0")}`;
}

/**
 * Generates an 10-character strong temporary password.
 */
export function generateTemporaryPassword(): string {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789!@#$%&*";
  let pwd = "";
  for (let i = 0; i < 10; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
}

export async function createStudent(
  data: CreateStudentInput,
  actorId: string,
  ip = "127.0.0.1"
) {
  await connectToDatabase();

  const email = data.email.trim().toLowerCase();
  const existing = await User.findOne({ email });

  if (existing) {
    if (existing.deletedAt) {
      throw ApiError.conflict(
        "A previously archived account with this email exists. Please restore or use another email."
      );
    }
    throw ApiError.conflict("An account with this email address already exists.");
  }

  const studentCode = await generateNextStudentCode();
  const rawPassword = data.customPassword || generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  const student = await User.create({
    role: ROLES.STUDENT,
    studentCode,
    name: data.name.trim(),
    email,
    phone: data.phone || "",
    passwordHash,
    passwordUpdatedAt: new Date(),
    status: USER_STATUS.ACTIVE,
    profile: {
      dob: data.profile?.dob,
      gender: data.profile?.gender,
      idNumber: data.profile?.idNumber,
      address: data.profile?.address,
      education: data.profile?.education,
      occupation: data.profile?.occupation,
      experienceLevel: data.profile?.experienceLevel || "beginner",
      emergencyContact: data.profile?.emergencyContact,
      source: data.profile?.source,
      tags: data.profile?.tags || [],
    },
    adminNotes: data.adminNotes || "",
    security: {
      failedLogins: 0,
      strikes: 0,
      securityLocked: false,
    },
    createdBy: actorId,
  });

  await recordAuditLog({
    actorId,
    action: "student.create",
    entityType: "user",
    entityId: student._id.toString(),
    summary: `Created student ${student.name} (${student.studentCode})`,
    after: {
      studentCode,
      name: student.name,
      email: student.email,
      phone: student.phone,
    },
    ip,
  });

  return {
    student: {
      id: student._id.toString(),
      studentCode: student.studentCode,
      name: student.name,
      email: student.email,
      phone: student.phone,
      status: student.status,
      createdAt: student.createdAt,
    },
    temporaryPassword: rawPassword,
  };
}

export interface ListStudentsOptions {
  page?: number;
  limit?: number;
  sort?: string;
  order?: "asc" | "desc";
  q?: string;
  status?: string;
  experienceLevel?: string;
  tag?: string;
}

export async function listStudents(options: ListStudentsOptions = {}) {
  await connectToDatabase();

  const page = Math.max(1, options.page || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, options.limit || PAGINATION.DEFAULT_LIMIT)
  );
  const skip = (page - 1) * limit;

  // Base query
  const query: Record<string, unknown> = {
    role: ROLES.STUDENT,
    deletedAt: null,
  };

  // Status filter
  if (options.status && options.status !== "all") {
    query.status = options.status;
  }

  // Experience level filter
  if (options.experienceLevel && options.experienceLevel !== "all") {
    query["profile.experienceLevel"] = options.experienceLevel;
  }

  // Tag filter
  if (options.tag) {
    query["profile.tags"] = options.tag;
  }

  // Search filter
  if (options.q) {
    const qTrim = options.q.trim();
    query.$or = [
      { name: { $regex: qTrim, $options: "i" } },
      { email: { $regex: qTrim, $options: "i" } },
      { studentCode: { $regex: qTrim, $options: "i" } },
      { phone: { $regex: qTrim, $options: "i" } },
    ];
  }

  // Sort
  const sortField = options.sort || "createdAt";
  const sortOrder = options.order === "asc" ? 1 : -1;

  const [items, total] = await Promise.all([
    User.find(query)
      .select("-passwordHash")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
  };
}

export async function getStudentById(id: string) {
  await connectToDatabase();

  const student = await User.findOne({
    _id: id,
    role: ROLES.STUDENT,
    deletedAt: null,
  })
    .select("-passwordHash")
    .lean();

  if (!student) {
    throw ApiError.notFound("Student not found");
  }

  return student;
}

export async function updateStudent(
  id: string,
  data: UpdateStudentInput,
  actorId: string,
  ip = "127.0.0.1"
) {
  await connectToDatabase();

  const student = await User.findOne({
    _id: id,
    role: ROLES.STUDENT,
    deletedAt: null,
  });

  if (!student) {
    throw ApiError.notFound("Student not found");
  }

  const before = student.toObject();

  if (data.name !== undefined) student.name = data.name.trim();
  if (data.phone !== undefined) student.phone = data.phone;
  if (data.adminNotes !== undefined) student.adminNotes = data.adminNotes;

  if (data.email !== undefined) {
    const newEmail = data.email.trim().toLowerCase();
    if (newEmail !== student.email) {
      const existing = await User.findOne({
        email: newEmail,
        _id: { $ne: id },
      });
      if (existing) {
        throw ApiError.conflict("An account with this email address already exists.");
      }
      student.email = newEmail;
    }
  }

  if (data.status !== undefined && data.status !== student.status) {
    student.status = data.status;
    if (data.status !== USER_STATUS.ACTIVE) {
      await AuthSession.updateMany(
        { userId: id, revokedAt: null },
        {
          $set: {
            revokedAt: new Date(),
            revokedReason: REVOKED_REASONS.ADMIN,
          },
        }
      );
    }
  }

  if (data.profile) {
    const p = data.profile;
    student.profile = {
      ...student.profile,
      ...p,
      dob: p.dob ? new Date(p.dob) : student.profile?.dob,
      tags: p.tags || student.profile?.tags || [],
    };
  }

  await student.save();

  await recordAuditLog({
    actorId,
    action: "student.update",
    entityType: "user",
    entityId: student._id.toString(),
    summary: `Updated profile for student ${student.name} (${student.studentCode})`,
    before: { name: before.name, email: before.email, phone: before.phone, status: before.status, profile: before.profile },
    after: { name: student.name, email: student.email, phone: student.phone, status: student.status, profile: student.profile },
    ip,
  });

  return student.toObject();
}

export async function unlockStudentSecurity(
  id: string,
  actorId: string,
  ip = "127.0.0.1"
) {
  await connectToDatabase();

  const student = await User.findOne({
    _id: id,
    role: ROLES.STUDENT,
    deletedAt: null,
  });

  if (!student) {
    throw ApiError.notFound("Student not found");
  }

  student.security = {
    failedLogins: 0,
    strikes: 0,
    securityLocked: false,
    lockedUntil: null,
  };

  await student.save();

  await recordAuditLog({
    actorId,
    action: "student.security_unlock",
    entityType: "user",
    entityId: student._id.toString(),
    summary: `Manually reset security lock and cleared strikes for ${student.name} (${student.studentCode})`,
    ip,
  });

  return { ok: true, message: "Security lock reset and strikes cleared." };
}

export async function softDeleteStudent(
  id: string,
  actorId: string,
  ip = "127.0.0.1"
) {
  await connectToDatabase();

  const student = await User.findOne({
    _id: id,
    role: ROLES.STUDENT,
    deletedAt: null,
  });

  if (!student) {
    throw ApiError.notFound("Student not found");
  }

  student.deletedAt = new Date();
  student.status = USER_STATUS.INACTIVE;
  await student.save();

  // Revoke all active sessions immediately
  await AuthSession.updateMany(
    { userId: id, revokedAt: null },
    {
      $set: {
        revokedAt: new Date(),
        revokedReason: REVOKED_REASONS.ADMIN,
      },
    }
  );

  await recordAuditLog({
    actorId,
    action: "student.delete",
    entityType: "user",
    entityId: student._id.toString(),
    summary: `Soft-deleted student ${student.name} (${student.studentCode})`,
    ip,
  });

  return { ok: true, message: "Student account deleted." };
}

export async function resetStudentPassword(
  id: string,
  customPassword?: string,
  actorId = "",
  ip = "127.0.0.1"
) {
  await connectToDatabase();

  const student = await User.findOne({
    _id: id,
    role: ROLES.STUDENT,
    deletedAt: null,
  });

  if (!student) {
    throw ApiError.notFound("Student not found");
  }

  const rawPassword = customPassword || generateTemporaryPassword();
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  student.passwordHash = passwordHash;
  student.passwordUpdatedAt = new Date();
  if (student.security) {
    student.security.failedLogins = 0;
    student.security.lockedUntil = null;
  }
  await student.save();

  // Revoke all active student sessions so they must re-authenticate with the new password
  await AuthSession.updateMany(
    { userId: id, revokedAt: null },
    {
      $set: {
        revokedAt: new Date(),
        revokedReason: REVOKED_REASONS.PASSWORD_RESET,
      },
    }
  );

  await recordAuditLog({
    actorId,
    action: "student.password_reset",
    entityType: "user",
    entityId: student._id.toString(),
    summary: `Reset password for student ${student.name} (${student.studentCode})`,
    ip,
  });

  return { temporaryPassword: rawPassword };
}

export async function changeStudentStatus(
  id: string,
  status: UserStatus,
  reason = "",
  actorId = "",
  ip = "127.0.0.1"
) {
  await connectToDatabase();

  const student = await User.findOne({
    _id: id,
    role: ROLES.STUDENT,
    deletedAt: null,
  });

  if (!student) {
    throw ApiError.notFound("Student not found");
  }

  const prevStatus = student.status;
  student.status = status;
  await student.save();

  // If set to inactive or suspended, kill active sessions
  if (status !== USER_STATUS.ACTIVE) {
    await AuthSession.updateMany(
      { userId: id, revokedAt: null },
      {
        $set: {
          revokedAt: new Date(),
          revokedReason: REVOKED_REASONS.ADMIN,
        },
      }
    );
  }

  await recordAuditLog({
    actorId,
    action: "student.status_change",
    entityType: "user",
    entityId: student._id.toString(),
    summary: `Changed status for student ${student.name} from ${prevStatus} to ${status}${reason ? ` (${reason})` : ""}`,
    before: { status: prevStatus },
    after: { status, reason },
    ip,
  });

  return { ok: true, status: student.status };
}

export async function getStudentSessions(studentId: string) {
  await connectToDatabase();

  const sessions = await AuthSession.find({ userId: studentId })
    .sort({ lastSeenAt: -1 })
    .limit(20)
    .lean();

  return sessions;
}

export async function revokeStudentSessions(
  studentId: string,
  sid?: string,
  actorId = "",
  ip = "127.0.0.1"
) {
  await connectToDatabase();

  const query: Record<string, unknown> = {
    userId: studentId,
    revokedAt: null,
  };

  if (sid) {
    query.sid = sid;
  }

  const result = await AuthSession.updateMany(query, {
    $set: {
      revokedAt: new Date(),
      revokedReason: REVOKED_REASONS.ADMIN,
    },
  });

  await recordAuditLog({
    actorId,
    action: "session.revoke",
    entityType: "user",
    entityId: studentId,
    summary: sid
      ? `Revoked specific session (${sid}) for student ${studentId}`
      : `Revoked all active sessions for student ${studentId}`,
    ip,
  });

  return { ok: true, revokedCount: result.modifiedCount };
}

export async function bulkStudentAction(
  studentIds: string[],
  action: "activate" | "suspend" | "delete" | "add_tag" | "remove_tag",
  tag?: string,
  actorId = "",
  ip = "127.0.0.1"
) {
  await connectToDatabase();

  if (action === "activate") {
    await User.updateMany(
      { _id: { $in: studentIds }, role: ROLES.STUDENT, deletedAt: null },
      { $set: { status: USER_STATUS.ACTIVE } }
    );
  } else if (action === "suspend") {
    await User.updateMany(
      { _id: { $in: studentIds }, role: ROLES.STUDENT, deletedAt: null },
      { $set: { status: USER_STATUS.SUSPENDED } }
    );
    await AuthSession.updateMany(
      { userId: { $in: studentIds }, revokedAt: null },
      { $set: { revokedAt: new Date(), revokedReason: REVOKED_REASONS.ADMIN } }
    );
  } else if (action === "delete") {
    await User.updateMany(
      { _id: { $in: studentIds }, role: ROLES.STUDENT, deletedAt: null },
      { $set: { deletedAt: new Date(), status: USER_STATUS.INACTIVE } }
    );
    await AuthSession.updateMany(
      { userId: { $in: studentIds }, revokedAt: null },
      { $set: { revokedAt: new Date(), revokedReason: REVOKED_REASONS.ADMIN } }
    );
  } else if (action === "add_tag" && tag) {
    await User.updateMany(
      { _id: { $in: studentIds }, role: ROLES.STUDENT, deletedAt: null },
      { $addToSet: { "profile.tags": tag.trim() } }
    );
  } else if (action === "remove_tag" && tag) {
    await User.updateMany(
      { _id: { $in: studentIds }, role: ROLES.STUDENT, deletedAt: null },
      { $pull: { "profile.tags": tag.trim() } }
    );
  }

  await recordAuditLog({
    actorId,
    action: `student.bulk_${action}`,
    entityType: "user",
    entityId: "bulk",
    summary: `Executed bulk action '${action}' across ${studentIds.length} students${tag ? ` with tag: ${tag}` : ""}`,
    ip,
  });

  return { ok: true, affected: studentIds.length };
}
