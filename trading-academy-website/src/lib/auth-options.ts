import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { UAParser } from "ua-parser-js";
import { connectToDatabase } from "./db";
import { User } from "@/models/User";
import { AuthSession } from "@/models/AuthSession";
import {
  ROLES,
  USER_STATUS,
  REVOKED_REASONS,
  SECURITY_CONFIG,
  UserRole,
} from "./constants";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: SECURITY_CONFIG.SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only-change-me",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        deviceId: { label: "DeviceId", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing email or password");
        }

        await connectToDatabase();

        const email = credentials.email.trim().toLowerCase();
        const user = await User.findOne({
          email,
          deletedAt: null,
        }).select("+passwordHash");

        if (!user) {
          throw new Error("Invalid credentials");
        }

        const now = new Date();

        // 1. Check permanent security lock (anti-piracy lock)
        if (user.security?.securityLocked) {
          throw new Error(
            "Account locked for security reasons. Please contact ITT administration."
          );
        }

        // 2. Check temporary lockout from failed login attempts
        if (user.security?.lockedUntil && new Date(user.security.lockedUntil) > now) {
          const remainingMins = Math.ceil(
            (new Date(user.security.lockedUntil).getTime() - now.getTime()) / 60000
          );
          throw new Error(
            `Account temporarily locked due to excessive failed attempts. Please try again in ${remainingMins} minute(s).`
          );
        }

        // 3. Check general account status
        if (user.status !== USER_STATUS.ACTIVE) {
          throw new Error(
            `Account is ${user.status}. Please contact ITT administration.`
          );
        }

        // 4. Verify password
        const isMatch = await bcrypt.compare(
          credentials.password,
          user.passwordHash || ""
        );

        if (!isMatch) {
          // Increment failed logins
          const currentFailed = (user.security?.failedLogins || 0) + 1;
          user.security.failedLogins = currentFailed;

          if (currentFailed >= SECURITY_CONFIG.MAX_FAILED_LOGINS) {
            user.security.lockedUntil = new Date(
              now.getTime() + SECURITY_CONFIG.LOCK_DURATION_MINUTES * 60 * 1000
            );
          }

          await user.save();
          throw new Error("Invalid credentials");
        }

        // Reset failed login counter on success
        user.security.failedLogins = 0;
        user.security.lockedUntil = null;

        // 5. Single-device policy: If student, revoke existing active sessions
        if (user.role === ROLES.STUDENT) {
          await AuthSession.updateMany(
            { userId: user._id, revokedAt: null },
            {
              $set: {
                revokedAt: now,
                revokedReason: REVOKED_REASONS.REPLACED,
              },
            }
          );
        }

        // 6. Extract IP and User-Agent
        const headers = req?.headers as Record<string, string> | undefined;
        const forwardedFor = headers?.["x-forwarded-for"] || headers?.["x-real-ip"];
        const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";
        const uaString = headers?.["user-agent"] || "Unknown";

        // Parse human-readable device label
        const parser = new UAParser(uaString);
        const parsed = parser.getResult();
        const browser = parsed.browser.name || "Browser";
        const os = parsed.os.name || "OS";
        const deviceType = parsed.device.type
          ? parsed.device.type.charAt(0).toUpperCase() + parsed.device.type.slice(1)
          : "Desktop";
        const deviceLabel = `${browser} on ${os} (${deviceType})`;

        // 7. Create new AuthSession
        const sid = nanoid(32);
        const deviceId = credentials.deviceId?.trim() || nanoid(16);
        const expiresAt = new Date(
          now.getTime() + SECURITY_CONFIG.SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000
        );

        await AuthSession.create({
          sid,
          userId: user._id,
          deviceId,
          deviceLabel,
          ip,
          ua: uaString,
          lastSeenAt: now,
          expiresAt,
          revokedAt: null,
        });

        // 8. Update user last login telemetry
        user.lastLoginAt = now;
        user.lastLoginIp = ip;
        user.loginCount = (user.loginCount || 0) + 1;
        await user.save();

        return {
          id: user._id.toString(),
          role: user.role as UserRole,
          sid,
          studentCode: user.studentCode,
          name: user.name,
          email: user.email,
          avatar: user.avatar?.url || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.sid = user.sid;
        token.studentCode = user.studentCode;
        token.avatar = (user as any).avatar || null;
      }

      // Handle client session.update({ avatar: ... })
      if (trigger === "update" && session) {
        if (session.avatar !== undefined) {
          token.avatar = session.avatar;
        }
        if (session.name) {
          token.name = session.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.sid = token.sid as string;
        session.user.studentCode = token.studentCode as string | undefined;
        session.user.avatar = (token.avatar as string | null | undefined) ?? null;
      }
      return session;
    },
  },
};

export default authOptions;
