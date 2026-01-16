import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public paths that don't require authentication
  const publicPaths = ["/login", "/register"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // Get token from cookies
  const token = request.cookies.get("auth-token")?.value;
  
  console.log("Middleware - Path:", pathname, "Has token:", !!token);

  // Verify token
  const user = token ? await verifyToken(token) : null;
  
  console.log("Middleware - User verified:", !!user);

  // Redirect to login if accessing protected route without auth
  if (!isPublicPath && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    console.log("Middleware - Redirecting to login");
    return NextResponse.redirect(url);
  }

  // Redirect to dashboard if accessing auth pages while logged in
  if (isPublicPath && user) {
    console.log("Middleware - Redirecting to dashboard");
    return NextResponse.redirect(new URL("/dashboard", request.url));
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
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
