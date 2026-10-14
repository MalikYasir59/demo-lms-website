import { withApi } from "@/lib/api";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { ApiError } from "@/lib/errors";
import { updateStudentProfileSchema } from "@/lib/validators/student-profile";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "student",
  },
  async ({ auth }) => {
    await connectToDatabase();

    const student = await User.findOne({
      _id: auth!.id,
      deletedAt: null,
    })
      .select("-passwordHash -adminNotes")
      .lean();

    if (!student) {
      throw ApiError.notFound("Student account not found");
    }

    return student;
  }
);

export const PATCH = withApi(
  {
    role: "student",
    schema: updateStudentProfileSchema,
  },
  async ({ body, auth }) => {
    await connectToDatabase();

    const student = await User.findById(auth!.id);
    if (!student) {
      throw ApiError.notFound("Student account not found");
    }

    if (body.profile) {
      student.profile = {
        ...student.profile,
        ...body.profile,
      };
      await student.save();
    }

    const updated = await User.findById(auth!.id)
      .select("-passwordHash -adminNotes")
      .lean();

    return updated;
  }
);
