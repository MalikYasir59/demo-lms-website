import { withApi } from "@/lib/api";
import { getDashboardOverview } from "@/services/analytics.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async () => {
    return await getDashboardOverview();
  }
);
