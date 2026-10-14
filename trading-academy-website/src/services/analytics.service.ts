import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { Course } from "@/models/Course";
import { Module } from "@/models/Module";
import { Lecture } from "@/models/Lecture";
import { Enrollment } from "@/models/Enrollment";
import { LectureProgress } from "@/models/LectureProgress";
import { PlaybackSession } from "@/models/PlaybackSession";
import { SecurityEvent } from "@/models/SecurityEvent";
import { AuditLog } from "@/models/AuditLog";
import { DailyStat } from "@/models/DailyStat";
import { LectureStat } from "@/models/LectureStat";

// ─── DASHBOARD OVERVIEW ──────────────────────────────────────────────────────

export async function getDashboardOverview() {
  await connectToDatabase();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // 1. Parallel KPI queries
  const [
    totalStudents,
    activeStudentsCount,
    publishedCourses,
    activeEnrollments,
    watchTimeAgg,
    completionAgg,
    expiringIn7Days,
    openSecurityAlerts,
    expiringEnrollmentsList,
    recentAudits,
  ] = await Promise.all([
    // Total students
    User.countDocuments({ role: "student", deletedAt: null }),

    // Active students in last 30 days (either logged in or watched a lecture)
    User.countDocuments({
      role: "student",
      deletedAt: null,
      status: "active",
      lastLoginAt: { $gte: thirtyDaysAgo },
    }),

    // Published courses
    Course.countDocuments({ status: "published" }),

    // Active enrollments
    Enrollment.countDocuments({
      status: "active",
      startsAt: { $lte: now },
      $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
    }),

    // Watch hours in last 30 days from playback sessions
    PlaybackSession.aggregate([
      { $match: { startedAt: { $gte: thirtyDaysAgo } } },
      { $group: { _id: null, totalSec: { $sum: "$watchedSec" } } },
    ]),

    // Average completion rate across enrollments
    Enrollment.aggregate([
      { $match: { status: "active" } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $ne: ["$completedAt", null] }, 1, 0] },
          },
        },
      },
    ]),

    // Enrollments expiring within 7 days
    Enrollment.countDocuments({
      status: "active",
      expiresAt: { $gt: now, $lte: sevenDaysFromNow },
    }),

    // Open security alerts (severity warn, high, critical and unresolved)
    SecurityEvent.countDocuments({
      severity: { $in: ["warn", "high", "critical"] },
      "resolved.at": null,
    }),

    // Top 5 upcoming expiring enrollments
    Enrollment.find({
      status: "active",
      expiresAt: { $gt: now, $lte: sevenDaysFromNow },
    })
      .sort({ expiresAt: 1 })
      .limit(5)
      .populate<{ studentId: { name: string; email: string; studentCode: string } }>(
        "studentId",
        "name email studentCode"
      )
      .populate<{ courseId: { title: string; slug: string } }>(
        "courseId",
        "title slug"
      )
      .lean(),

    // Recent 6 audit actions
    AuditLog.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate<{ actorId: { name: string; email: string } }>("actorId", "name email")
      .lean(),
  ]);

  const watchHours30d = Math.round(
    ((watchTimeAgg[0]?.totalSec || 0) / 3600) * 10
  ) / 10;

  const avgCompletionRate =
    completionAgg.length > 0 && completionAgg[0].total > 0
      ? Math.round((completionAgg[0].completed / completionAgg[0].total) * 100)
      : 0;

  // 2. Trend data over past 14 days (daily active, daily watch hours)
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  fourteenDaysAgo.setUTCHours(0, 0, 0, 0);

  const dailySessionsAgg = await PlaybackSession.aggregate([
    { $match: { startedAt: { $gte: fourteenDaysAgo } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$startedAt" },
        },
        watchHours: { $sum: { $divide: ["$watchedSec", 3600] } },
        uniqueUsers: { $addToSet: "$userId" },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const trends = dailySessionsAgg.map((d) => ({
    date: d._id,
    watchHours: Math.round(d.watchHours * 10) / 10,
    activeLearners: d.uniqueUsers.length,
  }));

  return {
    kpis: {
      totalStudents,
      activeStudents: activeStudentsCount,
      publishedCourses,
      activeEnrollments,
      watchHours30d,
      avgCompletionRate,
      expiringIn7Days,
      openSecurityAlerts,
    },
    trends,
    expiringEnrollments: expiringEnrollmentsList.map((e) => ({
      id: String(e._id),
      studentName: e.studentId?.name || "Unknown",
      studentEmail: e.studentId?.email || "",
      studentCode: e.studentId?.studentCode || "",
      courseTitle: e.courseId?.title || "Unknown Course",
      expiresAt: e.expiresAt,
    })),
    recentAudits: recentAudits.map((a) => ({
      id: String(a._id),
      action: a.action,
      summary: a.summary,
      actorName: a.actorId?.name || "System",
      createdAt: a.createdAt,
    })),
  };
}

// ─── ANALYTICS: OVERVIEW ──────────────────────────────────────────────────────

export async function getOverviewAnalytics(params: {
  from?: string;
  to?: string;
  courseId?: string;
}) {
  await connectToDatabase();

  const now = new Date();
  const toDate = params.to ? new Date(params.to) : now;
  const fromDate = params.from
    ? new Date(params.from)
    : new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Time-series daily watch hours & sessions
  const matchFilter: Record<string, unknown> = {
    startedAt: { $gte: fromDate, $lte: toDate },
  };
  if (params.courseId) {
    matchFilter.courseId = new mongoose.Types.ObjectId(params.courseId);
  }

  const [dailyTimeline, topCoursesAgg, categoryMixAgg] = await Promise.all([
    PlaybackSession.aggregate([
      { $match: matchFilter },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$startedAt" } },
          watchHours: { $sum: { $divide: ["$watchedSec", 3600] } },
          sessionsCount: { $sum: 1 },
          activeUsers: { $addToSet: "$userId" },
        },
      },
      { $sort: { _id: 1 } },
    ]),

    PlaybackSession.aggregate([
      { $match: { startedAt: { $gte: fromDate, $lte: toDate } } },
      {
        $group: {
          _id: "$courseId",
          watchSec: { $sum: "$watchedSec" },
          viewers: { $addToSet: "$userId" },
        },
      },
      { $sort: { watchSec: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },
      {
        $project: {
          courseId: "$_id",
          title: "$course.title",
          watchHours: { $round: [{ $divide: ["$watchSec", 3600] }, 1] },
          activeLearners: { $size: "$viewers" },
        },
      },
    ]),

    Course.aggregate([
      { $match: { status: "published" } },
      { $unwind: "$categoryIds" },
      {
        $group: {
          _id: "$categoryIds",
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          categoryId: "$_id",
          name: "$category.name",
          courseCount: "$count",
        },
      },
    ]),
  ]);

  return {
    timeline: dailyTimeline.map((item) => ({
      date: item._id,
      watchHours: Math.round(item.watchHours * 10) / 10,
      sessionsCount: item.sessionsCount,
      activeLearners: item.activeUsers.length,
    })),
    topCourses: topCoursesAgg,
    categoryMix: categoryMixAgg,
  };
}

// ─── ANALYTICS: STUDENTS ─────────────────────────────────────────────────────

export async function getStudentsAnalytics(params: {
  page?: number;
  limit?: number;
  q?: string;
  status?: string;
  sortBy?: "progress" | "watchTime" | "engagement" | "streak";
}) {
  await connectToDatabase();

  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(params.limit) || 20));
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {
    role: "student",
    deletedAt: null,
  };

  if (params.status && params.status !== "all") {
    query.status = params.status;
  }

  if (params.q) {
    const regex = new RegExp(params.q, "i");
    query.$or = [
      { name: regex },
      { email: regex },
      { phone: regex },
      { studentCode: regex },
    ];
  }

  const [students, total] = await Promise.all([
    User.find(query)
      .select("name email phone studentCode status security lastLoginAt createdAt")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    User.countDocuments(query),
  ]);

  const studentIds = students.map((s) => s._id);

  // Parallel progress, watch-time, and active session stats per student
  const [progressAgg, sessionsAgg] = await Promise.all([
    LectureProgress.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      {
        $group: {
          _id: "$studentId",
          totalWatchedSec: { $sum: "$uniqueWatchedSec" },
          completedLectures: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          avgPercent: { $avg: "$percent" },
        },
      },
    ]),

    PlaybackSession.aggregate([
      { $match: { userId: { $in: studentIds } } },
      {
        $group: {
          _id: "$userId",
          sessionCount: { $sum: 1 },
          lastHeartbeat: { $max: "$lastHeartbeatAt" },
          uniqueDates: {
            $addToSet: {
              $dateToString: { format: "%Y-%m-%d", date: "$startedAt" },
            },
          },
        },
      },
    ]),
  ]);

  const progressMap = new Map(progressAgg.map((p) => [String(p._id), p]));
  const sessionsMap = new Map(sessionsAgg.map((s) => [String(s._id), s]));

  const now = new Date();

  const items = students.map((s) => {
    const sId = String(s._id);
    const p = progressMap.get(sId);
    const sess = sessionsMap.get(sId);

    const watchedHours = Math.round(((p?.totalWatchedSec || 0) / 3600) * 10) / 10;
    const avgProgress = Math.round(p?.avgPercent || 0);
    const completedLectures = p?.completedLectures || 0;
    const activeDays = sess?.uniqueDates?.length || 0;
    const strikeScore = s.security?.strikes || 0;

    // Last active calculation
    const lastActive = sess?.lastHeartbeat || s.lastLoginAt || s.createdAt;
    const daysSinceActive = Math.floor(
      (now.getTime() - new Date(lastActive).getTime()) / (24 * 60 * 60 * 1000)
    );

    // Engagement score (0-100) per Spec 9.1:
    // 35% progress + 25% consistency + 25% recency (decays over 14d) + 15% completion
    const recencyWeight = Math.max(0, 1 - daysSinceActive / 14);
    const consistencyWeight = Math.min(1, activeDays / 10);
    const engagementScore = Math.min(
      100,
      Math.round(
        avgProgress * 0.35 +
          consistencyWeight * 25 +
          recencyWeight * 25 +
          Math.min(15, completedLectures * 1.5)
      )
    );

    // Risk flag
    let riskFlag: "normal" | "at-risk" | "security-flag" = "normal";
    if (strikeScore >= 3 || s.security?.securityLocked) {
      riskFlag = "security-flag";
    } else if (daysSinceActive >= 7 && avgProgress < 100) {
      riskFlag = "at-risk";
    }

    return {
      id: sId,
      name: s.name,
      email: s.email,
      studentCode: s.studentCode,
      status: s.status,
      avgProgress,
      watchedHours,
      completedLectures,
      activeDays,
      strikeScore,
      engagementScore,
      riskFlag,
      lastActive,
      joinedAt: s.createdAt,
    };
  });

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── ANALYTICS: COURSES ──────────────────────────────────────────────────────

export async function getCoursesAnalytics() {
  await connectToDatabase();

  const courses = await Course.find({ status: { $ne: "archived" } })
    .select("title slug status featuredImage difficulty authorId categoryIds")
    .populate<{ authorId: { name: string } }>("authorId", "name")
    .populate<{ categoryIds: Array<{ name: string }> }>("categoryIds", "name")
    .lean();

  const courseIds = courses.map((c) => c._id);
  const now = new Date();
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  const sixtyDaysFromNow = new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000);

  // Enrollments breakdown per course
  const [enrollmentsAgg, sessionsAgg, progressAgg] = await Promise.all([
    Enrollment.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      {
        $group: {
          _id: "$courseId",
          totalEnrolled: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $ne: ["$completedAt", null] }, 1, 0] },
          },
          active: {
            $sum: { $cond: [{ $eq: ["$status", "active"] }, 1, 0] },
          },
          expiringIn7d: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ["$expiresAt", now] },
                    {
                      $lte: [
                        "$expiresAt",
                        new Date(now.getTime() + 7 * 24 * 3600 * 1000),
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
          expiringIn30d: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $gt: ["$expiresAt", now] },
                    {
                      $lte: [
                        "$expiresAt",
                        new Date(now.getTime() + 30 * 24 * 3600 * 1000),
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),

    // Active learners in last 14 days and total watch hours
    PlaybackSession.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      {
        $group: {
          _id: "$courseId",
          totalWatchSec: { $sum: "$watchedSec" },
          activeRecentLearners: {
            $addToSet: {
              $cond: [{ $gte: ["$startedAt", fourteenDaysAgo] }, "$userId", "$$REMOVE"],
            },
          },
        },
      },
    ]),

    // Average progress per course
    LectureProgress.aggregate([
      { $match: { courseId: { $in: courseIds } } },
      {
        $group: {
          _id: "$courseId",
          avgPercent: { $avg: "$percent" },
        },
      },
    ]),
  ]);

  const enrollMap = new Map(enrollmentsAgg.map((e) => [String(e._id), e]));
  const sessMap = new Map(sessionsAgg.map((s) => [String(s._id), s]));
  const progMap = new Map(progressAgg.map((p) => [String(p._id), p]));

  return courses.map((course) => {
    const cId = String(course._id);
    const en = enrollMap.get(cId);
    const se = sessMap.get(cId);
    const pr = progMap.get(cId);

    const totalEnrolled = en?.totalEnrolled || 0;
    const completed = en?.completed || 0;
    const completionRate =
      totalEnrolled > 0 ? Math.round((completed / totalEnrolled) * 100) : 0;
    const avgProgress = Math.round(pr?.avgPercent || 0);
    const totalWatchHours = Math.round(((se?.totalWatchSec || 0) / 3600) * 10) / 10;
    const activeLearners14d = se?.activeRecentLearners?.length || 0;

    return {
      id: cId,
      title: course.title,
      slug: course.slug,
      status: course.status,
      difficulty: course.difficulty,
      authorName: course.authorId?.name || "Instructor",
      categories: course.categoryIds?.map((c) => c.name) || [],
      totalEnrolled,
      activeLearners14d,
      completionRate,
      avgProgress,
      totalWatchHours,
      expiryOutlook: {
        in7Days: en?.expiringIn7d || 0,
        in30Days: en?.expiringIn30d || 0,
      },
    };
  });
}

// ─── ANALYTICS: COURSE DETAIL & FUNNEL ────────────────────────────────────────

export async function getCourseDetailAnalytics(courseId: string) {
  await connectToDatabase();

  const cObjId = new mongoose.Types.ObjectId(courseId);

  const [course, modules, lectures, enrollmentsCount, completedEnrollments] =
    await Promise.all([
      Course.findById(cObjId).select("title slug status").lean(),
      Module.find({ courseId: cObjId, deletedAt: null }).sort({ order: 1 }).lean(),
      Lecture.find({ courseId: cObjId, deletedAt: null }).sort({ order: 1 }).lean(),
      Enrollment.countDocuments({ courseId: cObjId }),
      Enrollment.countDocuments({ courseId: cObjId, completedAt: { $ne: null } }),
    ]);

  if (!course) {
    throw new Error("Course not found");
  }

  // Calculate lecture completion & drop-off stats
  const lectureIds = lectures.map((l) => l._id);
  const progressAgg = await LectureProgress.aggregate([
    { $match: { lectureId: { $in: lectureIds } } },
    {
      $group: {
        _id: "$lectureId",
        starts: { $sum: 1 },
        completions: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        avgPercent: { $avg: "$percent" },
      },
    },
  ]);

  const progMap = new Map(progressAgg.map((p) => [String(p._id), p]));

  // Module Funnel
  const moduleFunnel = modules.map((mod) => {
    const modLectures = lectures.filter(
      (l) => String(l.moduleId) === String(mod._id)
    );
    const modLectureIds = modLectures.map((l) => String(l._id));

    // Learners who completed at least one lecture in this module
    let completedModuleCount = 0;
    for (const lId of modLectureIds) {
      const stat = progMap.get(lId);
      if (stat && stat.completions > completedModuleCount) {
        completedModuleCount = stat.completions;
      }
    }

    return {
      moduleId: String(mod._id),
      title: mod.title,
      order: mod.order,
      lectureCount: modLectures.length,
      learnersCompleted: completedModuleCount,
      conversionPct:
        enrollmentsCount > 0
          ? Math.round((completedModuleCount / enrollmentsCount) * 100)
          : 0,
    };
  });

  // Lecture Drop-off Table
  const lectureDropoff = lectures.map((l) => {
    const stat = progMap.get(String(l._id));
    const starts = stat?.starts || 0;
    const completions = stat?.completions || 0;
    const dropoffPct =
      starts > 0 ? Math.round(((starts - completions) / starts) * 100) : 0;

    return {
      lectureId: String(l._id),
      title: l.title,
      order: l.order,
      starts,
      completions,
      avgWatchPct: Math.round(stat?.avgPercent || 0),
      dropoffPct,
    };
  });

  return {
    course: {
      id: String(course._id),
      title: course.title,
      totalEnrolled: enrollmentsCount,
      completedEnrollments,
      completionRate:
        enrollmentsCount > 0
          ? Math.round((completedEnrollments / enrollmentsCount) * 100)
          : 0,
    },
    moduleFunnel,
    lectureDropoff: lectureDropoff.sort((a, b) => b.dropoffPct - a.dropoffPct),
  };
}

// ─── ANALYTICS: ENGAGEMENT (DAU / WAU / MAU & HEATMAP) ─────────────────────────

export async function getEngagementAnalytics() {
  await connectToDatabase();

  const now = new Date();
  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [dauAgg, wauAgg, mauAgg, heatmapAgg] = await Promise.all([
    PlaybackSession.distinct("userId", { startedAt: { $gte: dayAgo } }),
    PlaybackSession.distinct("userId", { startedAt: { $gte: weekAgo } }),
    PlaybackSession.distinct("userId", { startedAt: { $gte: monthAgo } }),

    // Hourly heatmap by day of week (0=Sun to 6=Sat) over last 30 days
    PlaybackSession.aggregate([
      { $match: { startedAt: { $gte: monthAgo } } },
      {
        $project: {
          dayOfWeek: { $dayOfWeek: "$startedAt" }, // 1 (Sun) to 7 (Sat)
          hour: { $hour: "$startedAt" },
          watchedSec: 1,
        },
      },
      {
        $group: {
          _id: { day: "$dayOfWeek", hour: "$hour" },
          sessionCount: { $sum: 1 },
          totalMinutes: { $sum: { $divide: ["$watchedSec", 60] } },
        },
      },
    ]),
  ]);

  // Construct 7x24 grid
  const heatmapGrid: Array<{ day: number; hour: number; count: number }> = [];
  const mapData = new Map(
    heatmapAgg.map((h) => [`${h._id.day}-${h._id.hour}`, h.sessionCount])
  );

  for (let d = 1; d <= 7; d++) {
    for (let h = 0; h < 24; h++) {
      heatmapGrid.push({
        day: d - 1, // 0 = Sunday, 6 = Saturday
        hour: h,
        count: mapData.get(`${d}-${h}`) || 0,
      });
    }
  }

  return {
    dau: dauAgg.length,
    wau: wauAgg.length,
    mau: mauAgg.length,
    dauToMauRatio:
      mauAgg.length > 0 ? Math.round((dauAgg.length / mauAgg.length) * 100) : 0,
    heatmap: heatmapGrid,
  };
}

// ─── ANALYTICS: SECURITY ─────────────────────────────────────────────────────

export async function getSecurityAnalytics() {
  await connectToDatabase();

  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [eventsByType, eventsBySeverity, flaggedStudents, topIncidentLectures] =
    await Promise.all([
      // Events by type
      SecurityEvent.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$type", count: { $sum: 1 }, avgScore: { $avg: "$score" } } },
        { $sort: { count: -1 } },
      ]),

      // Events by severity
      SecurityEvent.aggregate([
        { $match: { createdAt: { $gte: thirtyDaysAgo } } },
        { $group: { _id: "$severity", count: { $sum: 1 } } },
      ]),

      // Flagged students (strikes >= 3 or securityLocked)
      User.find({
        role: "student",
        deletedAt: null,
        $or: [
          { "security.strikes": { $gte: 3 } },
          { "security.securityLocked": true },
        ],
      })
        .select("name email studentCode status security lastLoginAt")
        .sort({ "security.strikes": -1 })
        .limit(20)
        .lean(),

      // Top lectures with security incidents
      SecurityEvent.aggregate([
        {
          $match: {
            createdAt: { $gte: thirtyDaysAgo },
            lectureId: { $ne: null },
          },
        },
        { $group: { _id: "$lectureId", incidents: { $sum: 1 } } },
        { $sort: { incidents: -1 } },
        { $limit: 5 },
        {
          $lookup: {
            from: "lectures",
            localField: "_id",
            foreignField: "_id",
            as: "lecture",
          },
        },
        { $unwind: "$lecture" },
        {
          $project: {
            lectureId: "$_id",
            title: "$lecture.title",
            incidents: 1,
          },
        },
      ]),
    ]);

  return {
    byType: eventsByType.map((t) => ({
      type: t._id,
      count: t.count,
      avgScore: Math.round((t.avgScore || 0) * 10) / 10,
    })),
    bySeverity: eventsBySeverity.map((s) => ({
      severity: s._id,
      count: s.count,
    })),
    flaggedStudents: flaggedStudents.map((s) => ({
      id: String(s._id),
      name: s.name,
      email: s.email,
      studentCode: s.studentCode,
      status: s.status,
      strikeScore: s.security?.strikes || 0,
      securityLocked: Boolean(s.security?.securityLocked),
      lockReason: s.security?.lockReason || "",
    })),
    topIncidentLectures,
  };
}

// ─── NIGHTLY ROLLUP ENGINE (IDEMPOTENT) ────────────────────────────────────────

export async function computeRollups(targetDate?: Date) {
  await connectToDatabase();

  const date = targetDate ? new Date(targetDate) : new Date();
  // Set to yesterday midnight UTC
  date.setUTCDate(date.getUTCDate() - 1);
  date.setUTCHours(0, 0, 0, 0);

  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setUTCHours(23, 59, 59, 999);

  // 1. Platform daily rollup
  const [platformSessions, newStudentsCount, newEnrollmentsCount] = await Promise.all([
    PlaybackSession.aggregate([
      { $match: { startedAt: { $gte: startOfDay, $lte: endOfDay } } },
      {
        $group: {
          _id: null,
          totalSec: { $sum: "$watchedSec" },
          uniqueUsers: { $addToSet: "$userId" },
          sessionsCount: { $sum: 1 },
        },
      },
    ]),
    User.countDocuments({
      role: "student",
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }),
    Enrollment.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }),
  ]);

  const pData = platformSessions[0] || { totalSec: 0, uniqueUsers: [], sessionsCount: 0 };

  await DailyStat.findOneAndUpdate(
    { date: startOfDay, scope: "platform", refId: null },
    {
      $set: {
        metrics: {
          activeStudents: pData.uniqueUsers.length,
          newStudents: newStudentsCount,
          newEnrollments: newEnrollmentsCount,
          totalWatchSec: pData.totalSec,
          totalSessions: pData.sessionsCount,
        },
      },
    },
    { upsert: true, new: true }
  );

  // 2. Refresh LectureStat for all published lectures
  const lectures = await Lecture.find({ status: "published", deletedAt: null }).lean();
  for (const lecture of lectures) {
    const statsAgg = await LectureProgress.aggregate([
      { $match: { lectureId: lecture._id } },
      {
        $group: {
          _id: null,
          viewers: { $sum: 1 },
          completions: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          avgPercent: { $avg: "$percent" },
        },
      },
    ]);

    const stat = statsAgg[0] || { viewers: 0, completions: 0, avgPercent: 0 };
    const dropoffPct =
      stat.viewers > 0
        ? Math.round(((stat.viewers - stat.completions) / stat.viewers) * 100)
        : 0;

    await LectureStat.findOneAndUpdate(
      { lectureId: lecture._id },
      {
        $set: {
          courseId: lecture.courseId,
          viewers: stat.viewers,
          completions: stat.completions,
          avgWatchPct: Math.round(stat.avgPercent || 0),
          dropoffPct,
        },
      },
      { upsert: true }
    );
  }

  return { ok: true, processedDate: startOfDay.toISOString() };
}

// ─── CSV EXPORT STREAMING HELPER ──────────────────────────────────────────────

export async function exportAnalyticsCSV(type: string): Promise<string> {
  await connectToDatabase();

  if (type === "students") {
    const studentsRes = await getStudentsAnalytics({ limit: 1000 });
    const header = [
      "Student Code",
      "Full Name",
      "Email",
      "Status",
      "Avg Progress (%)",
      "Watch Time (Hours)",
      "Completed Lectures",
      "Active Days",
      "Strike Score",
      "Engagement Score",
      "Risk Flag",
      "Joined Date",
    ].join(",");

    const rows = studentsRes.items.map((s) =>
      [
        `"${s.studentCode || ""}"`,
        `"${s.name.replace(/"/g, '""')}"`,
        `"${s.email}"`,
        `"${s.status}"`,
        s.avgProgress,
        s.watchedHours,
        s.completedLectures,
        s.activeDays,
        s.strikeScore,
        s.engagementScore,
        `"${s.riskFlag}"`,
        `"${new Date(s.joinedAt).toISOString()}"`,
      ].join(",")
    );

    return [header, ...rows].join("\n");
  }

  if (type === "courses") {
    const courses = await getCoursesAnalytics();
    const header = [
      "Course Title",
      "Slug",
      "Status",
      "Author",
      "Total Enrolled",
      "Active Learners (14d)",
      "Completion Rate (%)",
      "Avg Progress (%)",
      "Total Watch Hours",
    ].join(",");

    const rows = courses.map((c) =>
      [
        `"${c.title.replace(/"/g, '""')}"`,
        `"${c.slug}"`,
        `"${c.status}"`,
        `"${c.authorName.replace(/"/g, '""')}"`,
        c.totalEnrolled,
        c.activeLearners14d,
        c.completionRate,
        c.avgProgress,
        c.totalWatchHours,
      ].join(",")
    );

    return [header, ...rows].join("\n");
  }

  return "No data available for export.";
}
