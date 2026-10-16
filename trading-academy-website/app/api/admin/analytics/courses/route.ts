import { withApi } from "@/lib/api";
import { getCoursesAnalytics } from "@/services/analytics.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async () => {
    return await getCoursesAnalytics();
  }
);
