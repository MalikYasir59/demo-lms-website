import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET || "fallback-secret-for-development-only-change-me";

  const token = await getToken({
    req,
    secret,
  });

  const response = NextResponse.next();

  // Apply baseline security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  // 1. Admin Login Page (/admin/login)
  if (pathname === "/admin/login") {
    if (token?.role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }
    return response;
  }

  // 2. Admin Routes (/admin/**)
  if (pathname.startsWith("/admin")) {
    response.headers.set("X-Frame-Options", "DENY");

    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "admin") {
      // Forbidden: redirect student attempting to access admin
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }

    return response;
  }

  // 3. Student Login Page (/login)
  if (pathname === "/login") {
    if (token) {
      if (token.role === "admin") {
        return NextResponse.redirect(new URL("/admin/dashboard", req.url));
      }
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }
    return response;
  }

  // 4. Student Portal & Learn Routes (/student/**)
  if (pathname.startsWith("/student")) {
    response.headers.set("X-Frame-Options", "SAMEORIGIN");

    if (!token) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (token.role !== "student") {
      // If admin visits student portal, allow or redirect to admin dashboard
      if (token.role === "admin") {
        return response; // Admins can preview student pages
      }
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return response;
  }

  return response;
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/student/:path*",
    "/login",
    "/admin/login",
  ],
};
