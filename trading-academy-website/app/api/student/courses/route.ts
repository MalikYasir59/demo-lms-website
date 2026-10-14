import { withApi } from "@/lib/api";
import { getStudentEnrollments } from "@/services/enrollment.service";
import { ENROLLMENT_STATUS } from "@/lib/constants";

export const dynamic = "force-dynamic";

export const GET = withApi(
  {
    role: "student",
  },
  async ({ auth }) => {
    return await getStudentEnrollments(auth!.id, {
      status: ENROLLMENT_STATUS.ACTIVE,
    });
  }
);
