import { NextResponse } from "next/server";
import { Course } from "@/models/Course";
import { connectToDatabase } from "@/lib/db";
import { COURSE_STATUS } from "@/lib/constants";
import { toErrorResponse } from "@/lib/errors";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();

    const courses = await Course.find({
      status: COURSE_STATUS.PUBLISHED,
      showOnPublicSite: true,
      deletedAt: null,
    })
      .populate("categoryIds", "name color slug")
      .populate("authorId", "name title avatar")
      .sort({ order: 1, createdAt: -1 })
      .select("-settings.drip -createdBy")
      .lean();

    return NextResponse.json(
      { ok: true, data: courses },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=120",
        },
      }
    );
  } catch (err) {
    return toErrorResponse(err);
  }
}
