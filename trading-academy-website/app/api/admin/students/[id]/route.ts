import { withApi } from "@/lib/api";
import { getIp } from "@/lib/auth";
import { updateStudentSchema } from "@/lib/validators/student";
import {
  getStudentById,
  updateStudent,
  softDeleteStudent,
} from "@/services/student.service";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "admin",
  },
  async ({ params }) => {
    return await getStudentById(params.id);
  }
);

export const PATCH = withApi(
  {
    role: "admin",
    schema: updateStudentSchema,
  },
  async ({ req, body, auth, params }) => {
    const ip = getIp(req);
    return await updateStudent(params.id, body, auth!.id, ip);
  }
);

export const DELETE = withApi(
  {
    role: "admin",
  },
  async ({ req, auth, params }) => {
    const ip = getIp(req);
    return await softDeleteStudent(params.id, auth!.id, ip);
  }
);
