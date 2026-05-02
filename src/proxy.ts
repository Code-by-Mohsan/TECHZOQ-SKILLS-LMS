import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import {
  canAccessStudentDashboard,
  isAdminRole,
  normalizeRole,
} from "@/lib/constants/auth";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "default_secret_please_change",
);

// Routes that require authentication
const protectedRoutes = ["/dashboard", "/admin"];

// Routes that require admin role
const adminRoutes = ["/admin"];

// Routes that should redirect to dashboard if already logged in
const authRoutes = ["/login", "/signup", "/register"];

async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Skip API routes and static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const user = token ? await verifyToken(token) : null;

  // Redirect logged-in users away from auth pages
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (user) {
      const redirectUrl = isAdminRole(user.role) ? "/admin" : "/dashboard/student";
      return NextResponse.redirect(new URL(redirectUrl, request.url));
    }
    return NextResponse.next();
  }

  // Check protected routes
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Check admin routes
    if (
      adminRoutes.some((route) => pathname.startsWith(route)) &&
      !isAdminRole(user.role)
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (
      pathname.startsWith("/dashboard") &&
      !canAccessStudentDashboard(normalizeRole(user.role))
    ) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, sitemap.xml, robots.txt
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
