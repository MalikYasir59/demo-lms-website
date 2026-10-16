import { withApi } from "@/lib/api";
import { updateCategorySchema } from "@/lib/validators/course";
import { updateCategory, deleteCategory } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const PATCH = withApi(
  {
    role: "admin",
    schema: updateCategorySchema,
  },
  async ({ body, auth, params }) => {
    return await updateCategory(params.id, body, auth!.id);
  }
);

export const DELETE = withApi(
  {
    role: "admin",
  },
  async ({ auth, params }) => {
    return await deleteCategory(params.id, auth!.id);
  }
);
