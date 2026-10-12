import { NextResponse, type NextRequest } from "next/server";

/**
 * Account pages need a login. This only checks that the session cookie is
 * there (fast, no API call); the pages themselves confirm it with the shop.
 * Logged-in visitors may still open the login page: their cookie can be
 * expired, and sending them on to /account would loop.
 */
const SESSION_COOKIE = "store_session";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const loggedIn = request.cookies.has(SESSION_COOKIE);
  const authPage = pathname === "/account/login" || pathname === "/account/register";

  if (!loggedIn && !authPage) {
    const url = new URL("/account/login", request.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/account", "/account/:path*"],
};
