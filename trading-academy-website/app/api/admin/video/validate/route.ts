import { withApi } from "@/lib/api";
import { validateVideoSchema } from "@/lib/validators/course";
import { validateVideo } from "@/services/course.service";

export const dynamic = "force-dynamic";

export const POST = withApi(
  {
    role: "admin",
    schema: validateVideoSchema,
  },
  async ({ body }) => {
    return await validateVideo(body.videoUrlOrId);
  }
);
