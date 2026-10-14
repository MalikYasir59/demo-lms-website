import { withApi } from "@/lib/api";
import { getCourseDetailAnalytics } from "@/services/analytics.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ params }) => {
    return await getCourseDetailAnalytics(params.id);
  }
);
