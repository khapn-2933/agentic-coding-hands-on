import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy-client";

// Public paths accessible without authentication. Everything else (including
// the homepage `/` and all stub routes) requires a signed-in user.
const PUBLIC_PATHS = new Set(["/login"]);
const AUTH_API_PREFIX = "/auth/";

export async function proxy(request: NextRequest) {
  const { response, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  if (pathname.startsWith(AUTH_API_PREFIX)) {
    return response;
  }

  const isPublic = PUBLIC_PATHS.has(pathname);

  if (!user && !isPublic) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|fonts/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff|woff2|ttf|otf)$).*)"],
};
