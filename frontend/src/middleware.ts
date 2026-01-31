import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

// ============================================================
// MULTI-TENANT MIDDLEWARE
// ============================================================
// Handles authentication and role-based routing:
// - Super Admin: Full organization access (org owner)
// - Admin: Organization manager
// - User: Staff member (limited by permissions)
// ============================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;

  // Verify token
  const user = token ? await verifyToken(token) : null;

  // Redirect to login if accessing protected route without auth
  if (!isPublicPath && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isPublicPath && user) {
    // Role-based default redirect
    if (user.role === "super_admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protected route checks based on role
  if (user) {
    // Organization management routes - Super Admin only
    if (
      pathname.startsWith("/org-dashboard") ||
      pathname.startsWith("/organization")
    ) {
      if (user.role !== "super_admin") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - *.png, *.jpg, *.jpeg, *.gif, *.svg, *.webp (image files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)).*)",
  ],
};
