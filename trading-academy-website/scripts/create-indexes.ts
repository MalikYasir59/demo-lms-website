/**
 * MongoDB Index Creation Script
 * Ensures all required collections and compound/TTL/text indexes exist per LMS Technical Specification Section 4.
 *
 * Usage: npx tsx scripts/create-indexes.ts
 */

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/itt_lms";

async function createIndexes() {
  console.log("Connecting to MongoDB:", MONGODB_URI.replace(/:([^@]+)@/, ":****@"));
  await mongoose.connect(MONGODB_URI);
  const db = mongoose.connection.db;

  if (!db) {
    throw new Error("Failed to get database handle from Mongoose connection.");
  }

  console.log("Database connected. Ensuring indexes...");

  // 1. users
  const users = db.collection("users");
  await users.createIndex({ email: 1 }, { unique: true });
  await users.createIndex({ studentCode: 1 }, { unique: true, sparse: true });
  await users.createIndex({ role: 1, status: 1, createdAt: -1 });
  await users.createIndex({ deletedAt: 1 });
  await users.createIndex(
    { name: "text", email: "text", phone: "text", studentCode: "text" },
    { name: "users_text_search" }
  );
  console.log("✓ users indexes created");

  // 2. categories
  const categories = db.collection("categories");
  await categories.createIndex({ slug: 1 }, { unique: true });
  console.log("✓ categories indexes created");

  // 3. authors
  const authors = db.collection("authors");
  await authors.createIndex({ slug: 1 }, { unique: true });
  console.log("✓ authors indexes created");

  // 4. courses
  const courses = db.collection("courses");
  await courses.createIndex({ slug: 1 }, { unique: true });
  await courses.createIndex({ status: 1, publishAt: 1 });
  await courses.createIndex({ categoryIds: 1 });
  await courses.createIndex({ authorId: 1 });
  await courses.createIndex({ title: "text", tags: "text" }, { name: "courses_text_search" });
  console.log("✓ courses indexes created");

  // 5. modules
  const modules = db.collection("modules");
  await modules.createIndex({ courseId: 1, order: 1 });
  console.log("✓ modules indexes created");

  // 6. lectures
  const lectures = db.collection("lectures");
  await lectures.createIndex({ moduleId: 1, order: 1 });
  await lectures.createIndex({ courseId: 1 });
  await lectures.createIndex({ "video.hmac": 1 });
  console.log("✓ lectures indexes created");

  // 7. enrollments
  const enrollments = db.collection("enrollments");
  await enrollments.createIndex({ studentId: 1, courseId: 1 }, { unique: true });
  await enrollments.createIndex({ courseId: 1, status: 1 });
  await enrollments.createIndex({ status: 1, expiresAt: 1 });
  await enrollments.createIndex({ studentId: 1, status: 1 });
  console.log("✓ enrollments indexes created");

  // 8. lecture_progress
  const progress = db.collection("lecture_progress");
  await progress.createIndex({ studentId: 1, lectureId: 1 }, { unique: true });
  await progress.createIndex({ studentId: 1, courseId: 1 });
  await progress.createIndex({ courseId: 1, lectureId: 1, status: 1 });
  await progress.createIndex({ lastWatchedAt: -1 });
  console.log("✓ lecture_progress indexes created");

  // 9. auth_sessions
  const authSessions = db.collection("auth_sessions");
  await authSessions.createIndex({ sid: 1 }, { unique: true });
  await authSessions.createIndex({ userId: 1, revokedAt: 1 });
  await authSessions.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  console.log("✓ auth_sessions indexes created (with TTL)");

  // 10. playback_tickets
  const tickets = db.collection("playback_tickets");
  await tickets.createIndex({ jti: 1 }, { unique: true });
  await tickets.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  console.log("✓ playback_tickets indexes created (with TTL)");

  // 11. playback_sessions
  const playbackSessions = db.collection("playback_sessions");
  await playbackSessions.createIndex({ userId: 1, startedAt: -1 });
  await playbackSessions.createIndex({ userId: 1, endedAt: 1, lastHeartbeatAt: -1 });
  await playbackSessions.createIndex({ lectureId: 1, startedAt: -1 });
  await playbackSessions.createIndex({ createdAt: 1 }, { expireAfterSeconds: 180 * 24 * 3600 });
  console.log("✓ playback_sessions indexes created (with 180-day TTL)");

  // 12. security_events
  const securityEvents = db.collection("security_events");
  await securityEvents.createIndex({ userId: 1, createdAt: -1 });
  await securityEvents.createIndex({ type: 1, createdAt: -1 });
  await securityEvents.createIndex({ severity: 1, "resolved.at": 1 });
  await securityEvents.createIndex({ createdAt: 1 }, { expireAfterSeconds: 365 * 24 * 3600 });
  console.log("✓ security_events indexes created (with 365-day TTL)");

  // 13. audit_logs
  const auditLogs = db.collection("audit_logs");
  await auditLogs.createIndex({ entityType: 1, entityId: 1, createdAt: -1 });
  await auditLogs.createIndex({ actorId: 1, createdAt: -1 });
  console.log("✓ audit_logs indexes created");

  // 14. rate_limits
  const rateLimits = db.collection("rate_limits");
  await rateLimits.createIndex({ key: 1 }, { unique: true });
  await rateLimits.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  console.log("✓ rate_limits indexes created (with TTL)");

  // 15. settings
  const settings = db.collection("settings");
  await settings.createIndex({ key: 1 }, { unique: true });
  console.log("✓ settings indexes created");

  // 16. daily_stats
  const dailyStats = db.collection("daily_stats");
  await dailyStats.createIndex({ date: 1, scope: 1, refId: 1 }, { unique: true });
  console.log("✓ daily_stats indexes created");

  // 17. lecture_stats
  const lectureStats = db.collection("lecture_stats");
  await lectureStats.createIndex({ lectureId: 1 }, { unique: true });
  await lectureStats.createIndex({ courseId: 1 });
  console.log("✓ lecture_stats indexes created");

  console.log("\nAll indexes successfully verified and ensured!");
  await mongoose.disconnect();
}

createIndexes().catch((err) => {
  console.error("Index creation failed:", err);
  process.exit(1);
});
