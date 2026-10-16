import { withApi } from "@/lib/api";
import { createCategorySchema } from "@/lib/validators/course";
import { listCategories, createCategory } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async () => {
    return await listCategories();
  }
);

export const POST = withApi(
  {
    role: "admin",
    schema: createCategorySchema,
  },
  async ({ body, auth }) => {
    return await createCategory(body, auth!.id);
  }
);
