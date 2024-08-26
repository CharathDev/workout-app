import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const role = req.cookies.get("role")?.value;
  const boolRole = role == "true";
  console.log(boolRole);

  // If there's no token, the user is not authenticated
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Example: Restrict access to `/admin` based on role
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!boolRole) {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect if not admin
    }
  }

  // Example: Allow access to `/user` for any logged-in user
  if (req.nextUrl.pathname.startsWith("/user")) {
    if (boolRole) {
      return NextResponse.redirect(new URL("/", req.url)); // Redirect to login if role is not found
    }
  }

  return NextResponse.next(); // Allow the request to proceed
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"], // Apply middleware to these routes
};
