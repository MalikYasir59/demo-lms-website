import { withApi } from "@/lib/api";
import { getStudentLectureData } from "@/services/progress.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "student",
  },
  async ({ auth, params }) => {
    return await getStudentLectureData(auth!.id, params.lectureId);
  }
);
