import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  // Get token safely
  let token = null;
  try {
    token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  } catch (error) {
    // If token retrieval fails, treat as unauthenticated
    token = null;
  }

  // Authenticated user trying to access login → redirect home
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Unauthenticated user trying to access favorites → redirect to login (without callback)
  if (!token && pathname === "/favorites") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/favorites", "/login"],
};