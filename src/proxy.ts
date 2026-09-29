import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { checkAccountAccess } from "@/features/auth/api/checkAccountAccess";
import { sellerAccessDestination } from "@/features/auth/helpers/routeAccess";

const internationalize = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const response = internationalize(request);
  if (response.headers.has("location")) return response;
  const segments = request.nextUrl.pathname.split("/").filter(Boolean);
  const hasLocale = routing.locales.includes(segments[0] as typeof routing.locales[number]);
  const locale = hasLocale ? segments.shift()! : routing.defaultLocale;
  const isSeller = segments[0] === "seller";
  const protectedRoute = isSeller || segments[0] === "dashboard" || (segments[0] === "become-seller" && segments[1] === "status");
  if (!protectedRoute) return response;

  const loginRedirect = () => {
    const url = new URL(`/${locale}/login`, request.url);
    url.searchParams.set("returnUrl", request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  };
  const cookie = request.cookies.get("tofaToken")?.value;
  if (!cookie) return loginRedirect();
  let token: string;
  try { token = decodeURIComponent(cookie); } catch { return loginRedirect(); }
  const access = await checkAccountAccess(token, isSeller);
  if (access.kind === "unauthorized") return loginRedirect();
  if (access.kind === "unavailable") {
    return new NextResponse("Account access could not be verified. Please try again shortly.", {
      status: 503,
      headers: { "Cache-Control": "no-store", "Retry-After": "10" },
    });
  }
  if (isSeller && access.status && access.status !== "approved") {
    return NextResponse.redirect(new URL(sellerAccessDestination(access.status, locale), request.url));
  }
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
