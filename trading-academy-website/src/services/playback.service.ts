import mongoose from "mongoose";
import { nanoid } from "nanoid";
import { connectToDatabase } from "@/lib/db";
import { PlaybackTicket } from "@/models/PlaybackTicket";
import { PlaybackSession } from "@/models/PlaybackSession";
import { SecurityEvent } from "@/models/SecurityEvent";
import { User } from "@/models/User";
import { Course } from "@/models/Course";
import { Module } from "@/models/Module";
import { Lecture } from "@/models/Lecture";
import { Enrollment } from "@/models/Enrollment";
import { AuthSession } from "@/models/AuthSession";
import { LectureProgress } from "@/models/LectureProgress";
import { decryptVideoId } from "@/lib/crypto";
import {
  createPlaybackTicket,
  verifyPlaybackTicket,
  hashClientFingerprint,
} from "@/lib/tickets";
import { hasAccess, isLectureUnlocked } from "./enrollment.service";
import { recordLectureProgress } from "./progress.service";
import { ApiError } from "@/lib/errors";
import {
  ENROLLMENT_STATUS,
  LECTURE_STATUS,
  ERROR_CODES,
  SECURITY_SEVERITY,
  SecuritySeverity,
} from "@/lib/constants";
import { ILecture, IModule, IEnrollment } from "@/types/lms";

/**
 * Technical Specification Section 6.6 & 7.3: Request Ticket Flow
 * Validates enrollment, single device, drip rules, issues 90-second ticket with watermark data.
 */
export async function requestPlaybackTicket({
  studentId,
  sid,
  lectureId,
  deviceId,
  ip = "127.0.0.1",
  ua = "",
}: {
  studentId: string;
  sid: string;
  lectureId: string;
  deviceId?: string;
  ip?: string;
  ua?: string;
}) {
  await connectToDatabase();

  // 1. Validate student account & single device policy
  const [student, session] = await Promise.all([
    User.findOne({ _id: studentId, deletedAt: null }),
    AuthSession.findOne({ sid, userId: studentId, revokedAt: null }),
  ]);

  if (!student || student.status !== "active") {
    throw ApiError.unauthorized("Account inactive or suspended", ERROR_CODES.ACCOUNT_INACTIVE);
  }
  if (!session) {
    throw ApiError.unauthorized(
      "Session revoked. Single device policy in effect.",
      ERROR_CODES.SESSION_REPLACED
    );
  }

  // 2. Fetch lecture & course
  const lecture = await Lecture.findOne({
    _id: lectureId,
    status: LECTURE_STATUS.PUBLISHED,
    deletedAt: null,
  }).lean();

  if (!lecture) {
    throw ApiError.notFound("Lecture not found or not published");
  }

  const course = await Course.findOne({
    _id: lecture.courseId,
    deletedAt: null,
  }).lean();

  if (!course) {
    throw ApiError.notFound("Course not found");
  }

  // 3. Verify effective enrollment
  const enrollment = await Enrollment.findOne({
    studentId,
    courseId: lecture.courseId,
  }).lean();

  if (!enrollment || !hasAccess(enrollment)) {
    throw ApiError.forbidden(
      "Active enrollment required to stream this lecture",
      ERROR_CODES.NOT_ENROLLED
    );
  }

  // 4. Verify lecture unlock state (drip rules)
  const [module, allLectures, studentProgress] = await Promise.all([
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

  const completedSet = new Set(
    studentProgress
      .filter((p) => p.status === "completed")
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
      dripCheck.reason || "Lecture is locked by drip schedule",
      ERROR_CODES.LECTURE_LOCKED
    );
  }

  // 5. Rate limit: Max 12 ticket requests per minute per student
  const oneMinuteAgo = new Date(Date.now() - 60000);
  const recentTicketsCount = await PlaybackTicket.countDocuments({
    userId: studentId,
    createdAt: { $gte: oneMinuteAgo },
  });

  if (recentTicketsCount >= 12) {
    throw ApiError.rateLimited("Too many playback requests. Please wait a moment.");
  }

  // 6. Generate JTI and client fingerprint hashes
  const jti = nanoid(24);
  const ipHash = hashClientFingerprint(ip);
  const uaHash = hashClientFingerprint(ua);
  const expiresAt = new Date(Date.now() + 90 * 1000); // 90 seconds per spec 6.6

  // 7. Save ticket record
  await PlaybackTicket.create({
    jti,
    userId: studentId,
    sid,
    lectureId,
    ipHash,
    uaHash,
    expiresAt,
  });

  // 8. Sign JWT
  const signedJwt = await createPlaybackTicket({
    jti,
    userId: studentId,
    sid,
    lectureId,
    ipHash,
    uaHash,
  });

  // 9. Lookup student's resume point
  const currentProgress = studentProgress.find(
    (p) => p.lectureId.toString() === lectureId
  );
  const resumeAt = currentProgress?.lastPositionSec || 0;

  // Watermark forensic package
  const wm = {
    name: student.name,
    email: student.email,
    phone: student.phone || "",
    code: student.studentCode || "ITT-STUDENT",
    ip,
  };

  return {
    ticket: signedJwt,
    wm,
    resumeAt,
    durationSec: lecture.video?.durationSec || 0,
    rates: course.settings?.allowedRates || [0.75, 1, 1.25, 1.5, 2],
    heartbeatMs: 15000,
    allowSeekAhead: course.settings?.allowSeekAhead ?? true,
  };
}

/**
 * Technical Specification Section 6.6 & 7.4: Redeem Ticket Flow
 * One-time redemption, decrypts video reference, creates active PlaybackSession.
 */
export async function redeemPlaybackTicket({
  ticket,
  nonce,
  ip = "127.0.0.1",
  ua = "",
}: {
  ticket: string;
  nonce?: string;
  ip?: string;
  ua?: string;
}) {
  await connectToDatabase();

  let claims;
  try {
    claims = await verifyPlaybackTicket(ticket);
  } catch {
    throw ApiError.badRequest("Playback ticket signature is invalid or expired", ERROR_CODES.TICKET_INVALID);
  }

  // Atomic one-time use check
  const dbTicket = await PlaybackTicket.findOneAndDelete({
    jti: claims.jti,
    usedAt: null,
  });

  if (!dbTicket) {
    throw ApiError.badRequest("Ticket has already been redeemed or expired", ERROR_CODES.TICKET_INVALID);
  }

  // Fetch lecture with encrypted video reference
  const lecture = await Lecture.findById(claims.lectureId)
    .select("+video.ref")
    .lean();

  if (!lecture || !lecture.video?.ref) {
    throw ApiError.notFound("Video stream reference not found");
  }

  // Decrypt video ID using AES-256-GCM
  const rawVideoId = decryptVideoId(lecture.video.ref);

  // Close any stale active playback sessions for this student on this lecture
  await PlaybackSession.updateMany(
    {
      userId: claims.userId,
      lectureId: claims.lectureId,
      endedAt: null,
    },
    {
      $set: { endedAt: new Date(), endReason: "superseded" },
    }
  );

  // Create active PlaybackSession
  const session = await PlaybackSession.create({
    userId: claims.userId,
    courseId: lecture.courseId,
    lectureId: claims.lectureId,
    sid: claims.sid,
    deviceId: claims.ipHash,
    ip,
    startedAt: new Date(),
    lastHeartbeatAt: new Date(),
    watchedSec: 0,
    maxRate: 1,
    startPos: 0,
    endPos: 0,
  });

  return {
    psid: (session._id as mongoose.Types.ObjectId).toString(),
    p: {
      provider: "youtube",
      vid: rawVideoId,
      nonce: nonce || nanoid(16),
    },
  };
}

/**
 * Technical Specification Section 6.6 & 7.5: Heartbeat Flow
 * Called every 15s. Validates session liveness, single-device, merges watched ranges, detects anomalies.
 */
export async function processHeartbeat({
  psid,
  lectureId,
  from,
  pos,
  rate = 1,
  state = "playing",
  studentId,
}: {
  psid: string;
  lectureId: string;
  from: number;
  pos: number;
  rate?: number;
  state?: string;
  studentId: string;
}) {
  await connectToDatabase();

  const session = await PlaybackSession.findOne({
    _id: psid,
    userId: studentId,
  });

  if (!session) {
    return {
      next: 0,
      completed: false,
      terminate: { code: "SESSION_NOT_FOUND", message: "Playback session not found" },
    };
  }

  if (session.endedAt) {
    return {
      next: 0,
      completed: false,
      terminate: { code: "SESSION_ENDED", message: "Playback session has been terminated" },
    };
  }

  // Single device check: has the AuthSession been replaced or revoked?
  const authSession = await AuthSession.findOne({
    sid: session.sid,
    userId: studentId,
    revokedAt: null,
  });

  if (!authSession) {
    session.endedAt = new Date();
    session.endReason = "session_replaced";
    await session.save();

    return {
      next: 0,
      completed: false,
      terminate: {
        code: "SESSION_REPLACED",
        message: "Your account is actively playing video on another device.",
      },
    };
  }

  // Enrollment expiry check
  const enrollment = await Enrollment.findOne({
    studentId,
    courseId: session.courseId,
  });

  if (!enrollment || !hasAccess(enrollment)) {
    session.endedAt = new Date();
    session.endReason = "enrollment_expired";
    await session.save();

    return {
      next: 0,
      completed: false,
      terminate: {
        code: "ENROLLMENT_EXPIRED",
        message: "Your course enrollment has expired.",
      },
    };
  }

  // Record progress telemetry with interval merging
  const progressResult = await recordLectureProgress({
    studentId,
    lectureId,
    from,
    pos,
  });

  // Update playback session telemetry
  const delta = Math.abs(pos - from);
  session.lastHeartbeatAt = new Date();
  session.endPos = pos;
  session.watchedSec += delta;
  session.maxRate = Math.max(session.maxRate, rate);

  // Speed and jump anomaly checks
  if (delta > 35 && state === "playing") {
    session.anomalies.push(`jump_${Math.round(delta)}s_at_${Math.round(from)}`);
  }

  await session.save();

  return {
    next: 15000,
    completed: progressResult.isLectureCompleted,
    terminate: null,
  };
}

/**
 * Closes an active playback session cleanly.
 */
export async function endPlaybackSession({
  psid,
  studentId,
  reason = "normal",
}: {
  psid: string;
  studentId: string;
  reason?: string;
}) {
  await connectToDatabase();

  await PlaybackSession.findOneAndUpdate(
    { _id: psid, userId: studentId, endedAt: null },
    { $set: { endedAt: new Date(), endReason: reason } }
  );

  return { success: true };
}

/**
 * Technical Specification Section 6.6 & 7.10: Client Security Event Ingestion
 */
export async function reportSecurityEvent({
  userId,
  sid,
  type,
  lectureId,
  meta,
  ip = "127.0.0.1",
  ua = "",
}: {
  userId: string;
  sid?: string;
  type: string;
  lectureId?: string;
  meta?: Record<string, unknown>;
  ip?: string;
  ua?: string;
}) {
  await connectToDatabase();

  let severity: SecuritySeverity = SECURITY_SEVERITY.INFO;
  let score = 5;
  let action: "none" | "warn" | "pause" | "lock" = "none";

  switch (type) {
    case "devtools_open":
      severity = SECURITY_SEVERITY.HIGH;
      score = 30;
      action = "pause";
      break;
    case "tamper_detected":
      severity = SECURITY_SEVERITY.CRITICAL;
      score = 50;
      action = "lock";
      break;
    case "blur_lock":
      severity = SECURITY_SEVERITY.WARN;
      score = 10;
      action = "pause";
      break;
    case "shortcut_blocked":
      severity = SECURITY_SEVERITY.INFO;
      score = 5;
      action = "none";
      break;
    default:
      severity = SECURITY_SEVERITY.INFO;
      score = 5;
      action = "none";
  }

  await SecurityEvent.create({
    userId,
    sid: sid || "",
    type,
    severity,
    score,
    lectureId: lectureId ? new mongoose.Types.ObjectId(lectureId) : undefined,
    ip,
    ua,
    meta: meta || {},
  });

  return { action };
}
