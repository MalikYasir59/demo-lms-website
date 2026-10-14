import { withApi } from "@/lib/api";
import { getStudentsAnalytics } from "@/services/analytics.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ req }) => {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const q = searchParams.get("q") || undefined;
    const status = searchParams.get("status") || undefined;

    return await getStudentsAnalytics({ page, limit, q, status });
  }
);
