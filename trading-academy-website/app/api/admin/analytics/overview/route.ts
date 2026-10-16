import { withApi } from "@/lib/api";
import { getOverviewAnalytics } from "@/services/analytics.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ req }) => {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from") || undefined;
    const to = searchParams.get("to") || undefined;
    const courseId = searchParams.get("courseId") || undefined;

    return await getOverviewAnalytics({ from, to, courseId });
  }
);
