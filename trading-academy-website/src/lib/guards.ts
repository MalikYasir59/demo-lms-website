import { getSession, validateSession } from "./auth";
import { ApiError } from "./errors";
import { ROLES, ERROR_CODES, UserRole } from "./constants";

export interface AuthenticatedUser {
  id: string;
  role: UserRole;
  sid: string;
  studentCode?: string;
  name: string;
  email: string;
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const session = await getSession();

  if (!session?.user?.id || !session.user.sid) {
    throw ApiError.unauthorized("Authentication required", ERROR_CODES.AUTH_REQUIRED);
  }

  // Enforce DB-backed single device & revocation check on every request
  await validateSession(session.user.sid, session.user.id);

  return session.user as AuthenticatedUser;
}

export async function requireAdmin(): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (user.role !== ROLES.ADMIN) {
    throw ApiError.forbidden("Admin privilege required", ERROR_CODES.FORBIDDEN);
  }

  return user;
}

export async function requireStudent(): Promise<AuthenticatedUser> {
  const user = await requireAuth();

  if (user.role !== ROLES.STUDENT) {
    throw ApiError.forbidden("Student privilege required", ERROR_CODES.FORBIDDEN);
  }

  return user;
}
