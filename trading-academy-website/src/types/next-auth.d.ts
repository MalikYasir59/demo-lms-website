import { DefaultSession } from "next-auth";
import { UserRole } from "@/lib/constants";

declare module "next-auth" {
  interface User {
    id: string;
    role: UserRole;
    sid: string;
    studentCode?: string;
    name: string;
    email: string;
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      sid: string;
      studentCode?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
    sid: string;
    studentCode?: string;
  }
}
