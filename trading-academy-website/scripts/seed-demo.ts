/**
 * Seed Demo Student & Curriculum Script
 * Creates a demo student account, demo course, module, lecture, and active enrollment
 * so you can immediately test the student portal, course catalog, and secure player.
 *
 * Usage: npx tsx scripts/seed-demo.ts
 */

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { User } from "../src/models/User";
import { Course } from "../src/models/Course";
import { Module } from "../src/models/Module";
import { Lecture } from "../src/models/Lecture";
import { Category } from "../src/models/Category";
import { Author } from "../src/models/Author";
import { Enrollment } from "../src/models/Enrollment";
import { encryptVideoId, hashVideoId } from "../src/lib/crypto";
import { ROLES, USER_STATUS, COURSE_STATUS, ENROLLMENT_STATUS } from "../src/lib/constants";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/itt_lms";

async function seedDemoData() {
  console.log("Connecting to MongoDB:", MONGODB_URI.replace(/:([^@]+)@/, ":****@"));
  await mongoose.connect(MONGODB_URI);

  // 1. Seed Demo Student
  const studentEmail = "student@tradingtricks.institute";
  const studentPassword = "StudentPassword123!";

  let student = await User.findOne({ email: studentEmail, deletedAt: null });
  if (!student) {
    const passwordHash = await bcrypt.hash(studentPassword, 12);
    student = await User.create({
      name: "Ali Khan",
      email: studentEmail,
      phone: "+92 300 1234567",
      studentCode: "ITT-26-0001",
      passwordHash,
      role: ROLES.STUDENT,
      status: USER_STATUS.ACTIVE,
      profile: {
        experienceLevel: "intermediate",
        education: "BSc Economics & Quantitative Finance",
        occupation: "Prop Firm Funded Trader",
        tags: ["Forex", "Order Flow", "Indices"],
        address: {
          line1: "Blue Area, Sector F-6",
          city: "Islamabad",
          state: "Federal",
          country: "Pakistan",
          postalCode: "44000",
        },
      },
      security: {
        failedLogins: 0,
        strikes: 0,
        securityLocked: false,
      },
    });
    console.log("✓ Created Demo Student: Ali Khan (student@tradingtricks.institute)");
  } else {
    console.log("✓ Demo Student already exists");
  }

  // 2. Seed Category
  let category = await Category.findOne({ slug: "order-flow" });
  if (!category) {
    category = await Category.create({
      name: "Order Flow & Smart Money",
      slug: "order-flow",
      description: "Institutional market structure, fair value gaps, and liquidity sweeps.",
      color: "#6366f1",
      order: 1,
    });
    console.log("✓ Created Category: Order Flow & Smart Money");
  }

  // 3. Seed Author
  let author = await Author.findOne({ slug: "malik-yasir" });
  if (!author) {
    author = await Author.create({
      name: "Malik Yasir",
      slug: "malik-yasir",
      title: "Chief Market Technician & Funded Trader",
      bio: "8+ years institutional forex & futures trader specializing in algorithmic market structure and prop firm passing.",
    });
    console.log("✓ Created Author: Malik Yasir");
  }

  // 4. Seed Course
  let course = await Course.findOne({ slug: "price-action-mastery" });
  if (!course) {
    course = await Course.create({
      title: "Quantitative Price Action & Order Flow Mastery",
      slug: "price-action-mastery",
      description:
        "<p>This comprehensive curriculum takes you behind the scenes of interbank pricing algorithms and commercial order flow.</p>",
      difficulty: "intermediate",
      language: "english",
      status: COURSE_STATUS.PUBLISHED,
      categoryIds: [category._id],
      authorId: author._id,
      showOnPublicSite: true,
      settings: {
        allowSeekAhead: true,
        completionThreshold: 85,
        defaultAccessDurationDays: 365,
        drip: {
          mode: "none",
        },
      },
      stats: {
        totalModules: 1,
        totalLectures: 2,
        totalDurationSec: 3600,
        enrolledCount: 1,
      },
      createdBy: student._id,
    });
    console.log("✓ Created Course: Quantitative Price Action Mastery");
  }

  // 5. Seed Module
  let module = await Module.findOne({ courseId: course._id, order: 1 });
  if (!module) {
    module = await Module.create({
      courseId: course._id,
      title: "Module 1: Market Structure & Liquidity Concepts",
      description: "Understanding true swing points, break of structure, and liquidity pools.",
      order: 1,
      status: "published",
    });
    console.log("✓ Created Module 1");
  }

  // 6. Seed Lectures with Encrypted Video ID
  const rawYoutubeId = "dQw4w9WgXcQ"; // Sample verified video ID
  const encRef = encryptVideoId(rawYoutubeId);
  const hmac = hashVideoId(rawYoutubeId);

  let lecture1 = await Lecture.findOne({ courseId: course._id, order: 1 });
  if (!lecture1) {
    lecture1 = await Lecture.create({
      courseId: course._id,
      moduleId: module._id,
      title: "Lecture 1: The Liquidity Sweep & Fair Value Gaps",
      description:
        "Learn how institutional market makers hunt stops before generating trend extensions.",
      order: 1,
      status: "published",
      video: {
        provider: "youtube",
        ref: encRef,
        hmac,
        durationSec: 1800,
        sourceTitle: "Liquidity Sweep Architecture",
        verifiedAt: new Date(),
        version: 1,
      },
    });
    console.log("✓ Created Lecture 1 (Video ID encrypted with AES-256-GCM)");
  }

  let lecture2 = await Lecture.findOne({ courseId: course._id, order: 2 });
  if (!lecture2) {
    lecture2 = await Lecture.create({
      courseId: course._id,
      moduleId: module._id,
      title: "Lecture 2: Premium vs Discount Pricing & Order Blocks",
      description:
        "Identifying institutional accumulation zones and Fibonacci discount equilibrium.",
      order: 2,
      status: "published",
      video: {
        provider: "youtube",
        ref: encRef,
        hmac,
        durationSec: 1800,
        sourceTitle: "Order Block Mastery",
        verifiedAt: new Date(),
        version: 1,
      },
    });
    console.log("✓ Created Lecture 2 (Video ID encrypted with AES-256-GCM)");
  }

  // 7. Seed Active Enrollment for Demo Student
  let enrollment = await Enrollment.findOne({
    studentId: student._id,
    courseId: course._id,
  });

  if (!enrollment) {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    enrollment = await Enrollment.create({
      studentId: student._id,
      courseId: course._id,
      status: ENROLLMENT_STATUS.ACTIVE,
      startsAt: new Date(),
      expiresAt: oneYearFromNow,
      source: "admin",
      grantedBy: student._id,
      note: "Initial academy demo license",
      progress: {
        completedLectures: 0,
        totalLectures: 2,
        percent: 0,
      },
    });
    console.log("✓ Enrolled Student into Course (365 Days Access Active)");
  }

  console.log("\n========================================================");
  console.log(" Demo Data Successfully Seeded!");
  console.log("========================================================");
  console.log(" STUDENT CREDENTIALS:");
  console.log(" - Portal URL: http://localhost:3000/login");
  console.log(` - Email:      ${studentEmail}`);
  console.log(` - Password:   ${studentPassword}`);
  console.log(` - Code:       ITT-26-0001`);
  console.log("--------------------------------------------------------");
  console.log(" ADMIN CREDENTIALS:");
  console.log(" - Console:    http://localhost:3000/admin/login");
  console.log(" - Email:      admin@tradingtricks.institute");
  console.log(" - Password:   AdminPassword123!");
  console.log("========================================================");

  await mongoose.disconnect();
}

seedDemoData().catch((err) => {
  console.error("Failed to seed demo data:", err);
  process.exit(1);
});
