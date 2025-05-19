import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTokenExpired } from "./lib/auth/checkToken";

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get("user")?.value;

  if (!userCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const user = JSON.parse(userCookie);
    const token = user.token;

    if (!token || isTokenExpired(token)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } catch (err) {
    console.error("Invalid user cookie", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login).*)",
  ],
};
