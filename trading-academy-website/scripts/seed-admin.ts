/**
 * Seed Admin Account Script
 * Ensures a default administrative account exists in MongoDB Atlas for the LMS console.
 *
 * Usage: npx tsx scripts/seed-admin.ts
 */

import "./load-env";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../src/models/User";
import { ROLES, USER_STATUS } from "../src/lib/constants";
import { connectToDatabase, ALLOWED_DB_NAME } from "../src/lib/db";

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@tradingtricks.institute").toLowerCase().trim();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "AdminPassword123!";
const ADMIN_NAME = process.env.ADMIN_NAME || "ITT Master Admin";

async function seedAdmin() {
  console.log(`Connecting to MongoDB (target database: ${ALLOWED_DB_NAME})...`);
  const mongooseInstance = await connectToDatabase();

  const existingAdmin = await User.findOne({
    $or: [{ role: ROLES.ADMIN }, { email: ADMIN_EMAIL }],
    deletedAt: null,
  });

  if (existingAdmin) {
    console.log(`\nAn admin account already exists:`);
    console.log(`- Email: ${existingAdmin.email}`);
    console.log(`- Role: ${existingAdmin.role}`);
    console.log(`- Status: ${existingAdmin.status}`);
    console.log(`No changes made.`);
    await mongoose.disconnect();
    return;
  }

  console.log(`Hashing password with bcrypt cost 12...`);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

  const newAdmin = await User.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    phone: "+923000000000",
    passwordHash,
    role: ROLES.ADMIN,
    status: USER_STATUS.ACTIVE,
    security: {
      failedLogins: 0,
      strikes: 0,
      securityLocked: false,
      lockedUntil: null,
    },
    loginCount: 0,
  });

  console.log("\n========================================================");
  console.log(" Master Admin Account Successfully Created!");
  console.log("========================================================");
  console.log(` Email:    ${newAdmin.email}`);
  console.log(` Password: ${ADMIN_PASSWORD}`);
  console.log(` Role:     ${newAdmin.role}`);
  console.log("========================================================");
  console.log(" IMPORTANT: Please change this password upon first login.");
  console.log("========================================================\n");

  await mongoose.disconnect();
}

seedAdmin().catch((err) => {
  console.error("Failed to seed admin:", err);
  process.exit(1);
});
