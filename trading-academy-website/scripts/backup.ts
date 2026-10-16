/**
 * LMS Automated Database Backup Script
 * Exports primary collections (Users, Courses, Modules, Lectures, Enrollments, Progress, AuditLogs)
 * to a timestamped JSON snapshot file for disaster recovery on MongoDB Atlas M0.
 *
 * Usage: npx tsx scripts/backup.ts
 */

import mongoose from "mongoose";
import * as fs from "fs";
import * as path from "path";
import { connectToDatabase, ALLOWED_DB_NAME } from "../src/lib/db";

async function runBackup() {
  console.log(`Connecting to MongoDB (target database: ${ALLOWED_DB_NAME})...`);
  const mongooseInstance = await connectToDatabase();
  const db = mongooseInstance.connection.db;

  if (!db) {
    throw new Error("Could not connect to MongoDB database handle.");
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupDir = path.join(process.cwd(), "backups");

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const collections = [
    "users",
    "categories",
    "authors",
    "courses",
    "modules",
    "lectures",
    "enrollments",
    "lecture_progress",
    "audit_logs",
    "settings",
  ];

  const backupData: Record<string, unknown[]> = {};

  for (const collName of collections) {
    const coll = db.collection(collName);
    const docs = await coll.find({}).toArray();
    backupData[collName] = docs;
    console.log(`Backed up ${collName}: ${docs.length} records`);
  }

  const backupFilePath = path.join(backupDir, `lms-backup-${timestamp}.json`);
  fs.writeFileSync(backupFilePath, JSON.stringify(backupData, null, 2), "utf-8");

  console.log(`\n✓ Backup successfully written to: ${backupFilePath}`);
  await mongoose.disconnect();
}

runBackup().catch((err) => {
  console.error("Backup failed:", err);
  process.exit(1);
});
