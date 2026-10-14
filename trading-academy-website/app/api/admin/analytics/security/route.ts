import { withApi } from "@/lib/api";
import { getSecurityAnalytics } from "@/services/analytics.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async () => {
    return await getSecurityAnalytics();
  }
);
