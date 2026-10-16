export const APP_NAME = "Institute of Trading Tricks";
export const DEFAULT_TIMEZONE = "Asia/Karachi";

export const ROLES = {
  ADMIN: "admin",
  STUDENT: "student",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const USER_STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];

export const COURSE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
} as const;

export type CourseStatus = (typeof COURSE_STATUS)[keyof typeof COURSE_STATUS];

export const MODULE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export type ModuleStatus = (typeof MODULE_STATUS)[keyof typeof MODULE_STATUS];

export const LECTURE_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
} as const;

export type LectureStatus = (typeof LECTURE_STATUS)[keyof typeof LECTURE_STATUS];

export const ENROLLMENT_STATUS = {
  ACTIVE: "active",
  EXPIRED: "expired",
  SUSPENDED: "suspended",
  REVOKED: "revoked",
} as const;

export type EnrollmentStatus = (typeof ENROLLMENT_STATUS)[keyof typeof ENROLLMENT_STATUS];

export const PROGRESS_STATUS = {
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
} as const;

export type ProgressStatus = (typeof PROGRESS_STATUS)[keyof typeof PROGRESS_STATUS];

export const DRIP_MODES = {
  NONE: "none",
  SEQUENTIAL: "sequential",
  DAYS_AFTER_ENROLL: "daysAfterEnroll",
  FIXED_DATE: "fixedDate",
} as const;

export type DripMode = (typeof DRIP_MODES)[keyof typeof DRIP_MODES];

export const DIFFICULTY_LEVELS = {
  BEGINNER: "beginner",
  INTERMEDIATE: "intermediate",
  ADVANCED: "advanced",
  ALL: "all",
} as const;

export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[keyof typeof DIFFICULTY_LEVELS];

export const SECURITY_SEVERITY = {
  INFO: "info",
  WARN: "warn",
  HIGH: "high",
  CRITICAL: "critical",
} as const;

export type SecuritySeverity = (typeof SECURITY_SEVERITY)[keyof typeof SECURITY_SEVERITY];

export const REVOKED_REASONS = {
  REPLACED: "replaced",
  ADMIN: "admin",
  LOGOUT: "logout",
  SECURITY: "security",
  PASSWORD_RESET: "password_reset",
} as const;

export type RevokedReason = (typeof REVOKED_REASONS)[keyof typeof REVOKED_REASONS];

export const ERROR_CODES = {
  AUTH_REQUIRED: "AUTH_REQUIRED",
  SESSION_REPLACED: "SESSION_REPLACED",
  FORBIDDEN: "FORBIDDEN",
  ACCOUNT_INACTIVE: "ACCOUNT_INACTIVE",
  NOT_ENROLLED: "NOT_ENROLLED",
  ENROLLMENT_EXPIRED: "ENROLLMENT_EXPIRED",
  LECTURE_LOCKED: "LECTURE_LOCKED",
  DEVICE_LIMIT: "DEVICE_LIMIT",
  STREAM_ACTIVE: "STREAM_ACTIVE",
  TICKET_INVALID: "TICKET_INVALID",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  SECURITY_LOCKED: "SECURITY_LOCKED",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  LOCKED: 423,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

export const SECURITY_CONFIG = {
  MAX_FAILED_LOGINS: 5,
  LOCK_DURATION_MINUTES: 15,
  TICKET_EXPIRY_SECONDS: 120, // 2 minutes
  HEARTBEAT_INTERVAL_SECONDS: 15,
  HEARTBEAT_TIMEOUT_SECONDS: 45,
  STRIKES_BEFORE_LOCK: 3,
  SESSION_MAX_AGE_DAYS: 30,
  DEFAULT_COMPLETION_THRESHOLD: 90, // 90% unique watched seconds
} as const;
