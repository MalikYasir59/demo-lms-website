import { NextResponse } from "next/server";
import { ZodTypeAny, z } from "zod";
import { assertSameOrigin, getIp } from "./auth";
import { requireAdmin, requireStudent, requireAuth, AuthenticatedUser } from "./guards";
import { rateLimit } from "./rate-limit";
import { ApiError, toErrorResponse } from "./errors";
import { sanitizeMongoInput } from "./validators/common";

export interface WithApiOptions<T extends ZodTypeAny> {
  role?: "admin" | "student" | "any";
  schema?: T;
  limit?: [key: string, max: number, windowSec: number];
}

export interface ApiContext<T extends ZodTypeAny, P = Record<string, string>> {
  req: Request;
  body: z.infer<T>;
  auth: AuthenticatedUser | null;
  params: P;
}

export const withApi = <T extends ZodTypeAny, P = Record<string, string>>(
  opts: WithApiOptions<T>,
  handler: (ctx: ApiContext<T, P>) => Promise<unknown>
) => {
  return async (req: Request, context?: { params: Promise<P> | P }): Promise<NextResponse> => {
    try {
      // 1. Assert same-origin on state-mutating requests (CSRF protection)
      assertSameOrigin(req);

      // 2. Perform role/auth gate if required
      let auth: AuthenticatedUser | null = null;
      if (opts.role === "admin") {
        auth = await requireAdmin();
      } else if (opts.role === "student") {
        auth = await requireStudent();
      } else if (opts.role === "any") {
        auth = await requireAuth();
      }

      // 3. Rate limiting (per-user or per-IP)
      if (opts.limit) {
        const [prefix, max, windowSec] = opts.limit;
        const identifier = auth?.id || getIp(req);
        await rateLimit(`${prefix}:${identifier}`, max, windowSec);
      }

      // 4. Validate & parse body with Zod
      let body: z.infer<T> = undefined as z.infer<T>;
      if (opts.schema) {
        let rawBody: unknown;
        try {
          rawBody = await req.json();
        } catch {
          throw ApiError.badRequest("Invalid JSON in request body");
        }
        const cleanBody = sanitizeMongoInput(rawBody);
        body = opts.schema.parse(cleanBody);
      }

      // 5. Resolve route params (Next.js 15+ promise resolution)
      const params = context?.params ? await Promise.resolve(context.params) : ({} as P);

      // 6. Execute business handler
      const data = await handler({ req, body, auth, params });

      return NextResponse.json(
        { ok: true, data },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    } catch (error) {
      return toErrorResponse(error);
    }
  };
};

export default withApi;
