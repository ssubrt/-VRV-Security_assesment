import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUser } from "@/lib/auth";

const publicPaths = ["/login"];

export async function middleware(request: NextRequest) {
  const user = await getUser(request);
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  if (!user && !isPublicPath) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isPublicPath) {
    const homeUrl = new URL("/", request.url);
    return NextResponse.redirect(homeUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/roles",
    "/users"
  ],
};