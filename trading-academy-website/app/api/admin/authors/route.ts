import { withApi } from "@/lib/api";
import { createAuthorSchema } from "@/lib/validators/course";
import { listAuthors, createAuthor } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async () => {
    return await listAuthors();
  }
);

export const POST = withApi(
  {
    role: "admin",
    schema: createAuthorSchema,
  },
  async ({ body, auth }) => {
    return await createAuthor(body, auth!.id);
  }
);
