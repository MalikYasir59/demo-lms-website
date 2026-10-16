import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { User } from "@/models/User";
import { connectToDatabase } from "@/lib/db";
import { ROLES } from "@/lib/constants";
import { toErrorResponse } from "@/lib/errors";

export const dynamic = "force-dynamic";

function escapeCsvField(val: unknown): string {
  if (val === null || val === undefined) return "";
  const str = String(val).replace(/"/g, '""');
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str}"`;
  }
  return str;
}

export async function GET(req: Request) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const students = await User.find({
      role: ROLES.STUDENT,
      deletedAt: null,
    })
      .sort({ createdAt: -1 })
      .select("studentCode name email phone status profile.experienceLevel profile.tags createdAt")
      .lean();

    const headers = [
      "Student Code",
      "Name",
      "Email",
      "Phone",
      "Status",
      "Experience Level",
      "Tags",
      "Created At",
    ];

    const rows = students.map((s) => [
      s.studentCode || "",
      s.name || "",
      s.email || "",
      s.phone || "",
      s.status || "",
      s.profile?.experienceLevel || "",
      Array.isArray(s.profile?.tags) ? s.profile.tags.join(";") : "",
      s.createdAt ? new Date(s.createdAt).toISOString() : "",
    ]);

    const csvContent = [
      headers.map(escapeCsvField).join(","),
      ...rows.map((row) => row.map(escapeCsvField).join(",")),
    ].join("\r\n");

    const filename = `itt_students_${new Date().toISOString().slice(0, 10)}.csv`;

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
