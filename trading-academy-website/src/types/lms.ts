import { Types } from "mongoose";
import {
  UserRole,
  UserStatus,
  CourseStatus,
  ModuleStatus,
  LectureStatus,
  EnrollmentStatus,
  ProgressStatus,
  DripMode,
  DifficultyLevel,
  SecuritySeverity,
  RevokedReason,
} from "@/lib/constants";

export interface IAvatar {
  key?: string;
  url: string;
  updatedAt?: Date;
}

export interface IAddress {
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
}

export interface IEmergencyContact {
  name?: string;
  phone?: string;
  relation?: string;
}

export interface IUserProfile {
  dob?: Date;
  gender?: string;
  idNumber?: string;
  address?: IAddress;
  education?: string;
  occupation?: string;
  experienceLevel?: "beginner" | "intermediate" | "advanced";
  emergencyContact?: IEmergencyContact;
  source?: string;
  tags?: string[];
}

export interface IUserSecurity {
  failedLogins: number;
  lockedUntil?: Date | null;
  strikes: number;
  securityLocked: boolean;
  lockReason?: string;
  lastStrikeAt?: Date | null;
}

export interface IUser {
  _id: Types.ObjectId | string;
  role: UserRole;
  studentCode?: string;
  name: string;
  email: string;
  phone?: string;
  passwordHash?: string;
  passwordUpdatedAt?: Date;
  status: UserStatus;
  avatar?: IAvatar;
  profile?: IUserProfile;
  adminNotes?: string;
  security: IUserSecurity;
  acceptedTermsAt?: Date | null;
  lastLoginAt?: Date | null;
  lastLoginIp?: string;
  loginCount: number;
  createdBy?: Types.ObjectId | string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICategory {
  _id: Types.ObjectId | string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  order: number;
  courseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthorSocial {
  website?: string;
  linkedin?: string;
  youtube?: string;
  x?: string;
}

export interface IAuthor {
  _id: Types.ObjectId | string;
  name: string;
  slug: string;
  title?: string;
  bio?: string;
  avatar?: IAvatar;
  social?: IAuthorSocial;
  isActive: boolean;
  courseCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICourseSettings {
  drip: {
    mode: DripMode;
  };
  accessDays?: number | null; // null = lifetime
  maxStudents?: number | null;
  completionThreshold: number; // default 90%
  allowSeekAhead: boolean;
  allowedRates: number[];
}

export interface ICourseStats {
  moduleCount: number;
  lectureCount: number;
  totalDurationSec: number;
  enrolledCount: number;
}

export interface ICourse {
  _id: Types.ObjectId | string;
  title: string;
  slug: string;
  subtitle?: string;
  description?: string;
  thumbnail?: {
    key?: string;
    url: string;
  };
  introVideoUrl?: string;
  categoryIds: (Types.ObjectId | string)[];
  authorId?: Types.ObjectId | string;
  tags?: string[];
  difficulty: DifficultyLevel;
  language: string;
  status: CourseStatus;
  publishAt?: Date | null;
  publishedAt?: Date | null;
  showOnPublicSite: boolean;
  learningOutcomes?: string[];
  requirements?: string[];
  audience?: string[];
  settings: ICourseSettings;
  stats: ICourseStats;
  order: number;
  createdBy: Types.ObjectId | string;
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IModule {
  _id: Types.ObjectId | string;
  courseId: Types.ObjectId | string;
  title: string;
  description?: string;
  order: number;
  status: ModuleStatus;
  drip?: {
    unlockAfterDays?: number | null;
    unlockAt?: Date | null;
  };
  stats: {
    lectureCount: number;
    durationSec: number;
  };
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IVideoRef {
  enc: string;
  iv: string;
  tag: string;
}

export interface ILectureResource {
  _id?: Types.ObjectId | string;
  title: string;
  fileKey: string;
  originalName?: string;
  storedName?: string;
  mime: string;
  size: number;
  uploadedAt?: Date;
}

export interface ILecture {
  _id: Types.ObjectId | string;
  courseId: Types.ObjectId | string;
  moduleId: Types.ObjectId | string;
  title: string;
  description?: string;
  notesHtml?: string;
  order: number;
  type: "video";
  status: LectureStatus;
  video: {
    provider: "youtube";
    ref?: IVideoRef;
    hmac?: string;
    durationSec: number;
    sourceTitle?: string;
    verifiedAt?: Date;
    version: number;
  };
  resources?: ILectureResource[];
  drip?: {
    unlockAfterDays?: number | null;
  };
  deletedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEnrollmentProgress {
  completedLectures: number;
  totalLectures: number;
  percent: number;
  lastLectureId?: Types.ObjectId | string;
  lastActivityAt?: Date;
}

export interface IEnrollment {
  _id: Types.ObjectId | string;
  studentId: Types.ObjectId | string;
  courseId: Types.ObjectId | string;
  status: EnrollmentStatus;
  startsAt: Date;
  expiresAt?: Date | null;
  source: "admin" | "import";
  grantedBy: Types.ObjectId | string;
  note?: string;
  progress: IEnrollmentProgress;
  completedAt?: Date | null;
  revokedAt?: Date | null;
  revokeReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILectureProgress {
  _id: Types.ObjectId | string;
  studentId: Types.ObjectId | string;
  courseId: Types.ObjectId | string;
  moduleId: Types.ObjectId | string;
  lectureId: Types.ObjectId | string;
  status: ProgressStatus;
  lastPositionSec: number;
  durationSec: number;
  watchedRanges: [number, number][];
  uniqueWatchedSec: number;
  percent: number;
  totalWatchSec: number;
  playCount: number;
  firstWatchedAt?: Date;
  lastWatchedAt?: Date;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthSession {
  _id: Types.ObjectId | string;
  sid: string;
  userId: Types.ObjectId | string;
  deviceId: string;
  deviceLabel?: string;
  ip: string;
  ua: string;
  lastSeenAt: Date;
  expiresAt: Date;
  revokedAt?: Date | null;
  revokedReason?: RevokedReason;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlaybackTicket {
  _id: Types.ObjectId | string;
  jti: string;
  userId: Types.ObjectId | string;
  sid: string;
  lectureId: Types.ObjectId | string;
  ipHash: string;
  uaHash: string;
  usedAt?: Date | null;
  expiresAt: Date;
  createdAt: Date;
}

export interface IPlaybackSession {
  _id: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  courseId: Types.ObjectId | string;
  lectureId: Types.ObjectId | string;
  sid: string;
  deviceId: string;
  ip: string;
  startedAt: Date;
  lastHeartbeatAt: Date;
  endedAt?: Date | null;
  endReason?: string;
  watchedSec: number;
  maxRate: number;
  startPos: number;
  endPos: number;
  anomalies: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ISecurityEvent {
  _id: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  sid?: string;
  type: string;
  severity: SecuritySeverity;
  score: number;
  lectureId?: Types.ObjectId | string;
  courseId?: Types.ObjectId | string;
  ip: string;
  ua: string;
  meta?: Record<string, unknown>;
  resolved?: {
    by?: Types.ObjectId | string;
    at?: Date;
    note?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuditLog {
  _id: Types.ObjectId | string;
  actorId: Types.ObjectId | string;
  action: string;
  entityType: string;
  entityId: string;
  summary: string;
  diff?: {
    before?: Record<string, unknown>;
    after?: Record<string, unknown>;
  };
  ip?: string;
  createdAt: Date;
}

export interface ISetting {
  _id: Types.ObjectId | string;
  key: string;
  value: Record<string, unknown>;
  updatedBy: Types.ObjectId | string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IRateLimit {
  _id: Types.ObjectId | string;
  key: string;
  count: number;
  windowStart: Date;
  expiresAt: Date;
}

export interface IDailyStat {
  _id: Types.ObjectId | string;
  date: Date;
  scope: "platform" | "course" | "student" | "lecture";
  refId?: Types.ObjectId | string;
  metrics: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILectureStat {
  _id: Types.ObjectId | string;
  lectureId: Types.ObjectId | string;
  courseId: Types.ObjectId | string;
  viewers: number;
  completions: number;
  avgWatchPct: number;
  dropoffPct: number;
  heat: number[];
  createdAt: Date;
  updatedAt: Date;
}

// API types
export interface ApiResponse<T = unknown> {
  ok: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface PaginatedResult<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
