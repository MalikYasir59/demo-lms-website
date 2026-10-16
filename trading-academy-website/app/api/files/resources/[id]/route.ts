import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/guards";
import { connectToDatabase } from "@/lib/db";
import { Lecture } from "@/models/Lecture";
import { Enrollment } from "@/models/Enrollment";
import { storage } from "@/lib/storage";
import { ENROLLMENT_STATUS, ROLES } from "@/lib/constants";
import mongoose from "mongoose";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const user = await requireAuth();
    const resolvedParams = await Promise.resolve(context.params);
    const rawId = decodeURIComponent(resolvedParams.id || "");

    if (!rawId) {
      return new NextResponse("Invalid resource ID", { status: 400 });
    }

    await connectToDatabase();

    // Find the lecture that contains this resource
    let lecture;
    let resource;

    if (mongoose.Types.ObjectId.isValid(rawId)) {
      lecture = await Lecture.findOne({
        "resources._id": rawId,
        deletedAt: null,
      }).lean();
      resource = lecture?.resources?.find((r) => r._id?.toString() === rawId);
    }

    if (!resource) {
      lecture = await Lecture.findOne({
        "resources.fileKey": rawId,
        deletedAt: null,
      }).lean();
      resource = lecture?.resources?.find((r) => r.fileKey === rawId);
    }

    if (!lecture || !resource) {
      return new NextResponse("Resource not found", { status: 404 });
    }

    // Role-based access check
    if (user.role === ROLES.STUDENT) {
      const activeEnrollment = await Enrollment.findOne({
        studentId: user.id,
        courseId: lecture.courseId,
        status: ENROLLMENT_STATUS.ACTIVE,
      }).lean();

      if (!activeEnrollment) {
        return new NextResponse("Access denied. Enrollment required.", {
          status: 403,
        });
      }
    }

    // Read file from storage
    const fileResult = await storage.getFileBuffer(resource.fileKey);
    if (!fileResult) {
      return new NextResponse("File not found on storage server", { status: 404 });
    }

    const filename = resource.originalName || resource.title || "resource";
    const mime = resource.mime || "application/octet-stream";
    const disposition = mime === "application/pdf" ? "inline" : "attachment";

    return new NextResponse(fileResult.buffer as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": mime,
        "Content-Length": fileResult.size.toString(),
        "Content-Disposition": `${disposition}; filename="${encodeURIComponent(filename)}"`,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error: any) {
    if (error.status === 401 || error.code === "AUTH_REQUIRED") {
      return new NextResponse("Authentication required", { status: 401 });
    }
    if (error.status === 403) {
      return new NextResponse("Forbidden", { status: 403 });
    }
    console.error("[Resource Serving Error]:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
