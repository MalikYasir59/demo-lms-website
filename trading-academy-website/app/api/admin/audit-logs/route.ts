import { withApi } from "@/lib/api";
import { listAuditLogs } from "@/services/audit.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ req }) => {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : undefined;
    const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : undefined;
    const entityType = searchParams.get("entityType") || undefined;
    const action = searchParams.get("action") || undefined;
    const q = searchParams.get("q") || undefined;

    return await listAuditLogs({ page, limit, entityType, action, q });
  }
);
