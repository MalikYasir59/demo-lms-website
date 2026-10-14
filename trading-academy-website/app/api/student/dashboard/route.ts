import { withApi } from "@/lib/api";
import { getStudentDashboardData } from "@/services/progress.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "student",
  },
  async ({ auth }) => {
    return await getStudentDashboardData(auth!.id);
  }
);
