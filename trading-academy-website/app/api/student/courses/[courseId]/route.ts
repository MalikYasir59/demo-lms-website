import { withApi } from "@/lib/api";
import { getStudentCourseDetail } from "@/services/progress.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "student",
  },
  async ({ auth, params }) => {
    return await getStudentCourseDetail(auth!.id, params.courseId);
  }
);
