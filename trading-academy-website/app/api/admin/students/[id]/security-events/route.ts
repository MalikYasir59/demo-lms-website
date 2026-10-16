import { withApi } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { SecurityEvent } from "@/models/SecurityEvent";
import { AuditLog } from "@/models/AuditLog";
import { User } from "@/models/User";
import { ApiError } from "@/lib/errors";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ req, params }) => {
    await connectToDatabase();

    const studentId = params.id;
    const student = await User.findById(studentId).select("security name studentCode").lean();

    if (!student) {
      throw ApiError.notFound("Student not found");
    }

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get("limit") || "20", 10)));
    const severity = url.searchParams.get("severity");
    const type = url.searchParams.get("type");

    const query: Record<string, unknown> = {
      userId: studentId,
    };

    if (severity && severity !== "all") {
      query.severity = severity;
    }

    if (type && type !== "all") {
      query.type = type;
    }

    const skip = (page - 1) * limit;

    const [events, totalEvents, auditLogs] = await Promise.all([
      SecurityEvent.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      SecurityEvent.countDocuments(query),
      AuditLog.find({
        entityType: "user",
        entityId: studentId,
      })
        .populate("actorId", "name email")
        .sort({ createdAt: -1 })
        .limit(15)
        .lean(),
    ]);

    return {
      events,
      page,
      limit,
      total: totalEvents,
      totalPages: Math.ceil(totalEvents / limit) || 1,
      securitySummary: {
        strikes: student.security?.strikes || 0,
        securityLocked: student.security?.securityLocked || false,
        failedLogins: student.security?.failedLogins || 0,
        lockedUntil: student.security?.lockedUntil || null,
      },
      auditLogs,
    };
  }
);
