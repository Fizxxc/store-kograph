import { NextResponse, type NextRequest } from "next/server";
import { getSiteLifecycleState } from "@/lib/site-status";

const PUBLIC_FILE = /\.(.*)$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const state = getSiteLifecycleState(new Date());

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/manifest") ||
    pathname.startsWith("/robots") ||
    pathname.startsWith("/sitemap") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    const status = state === "sunset" ? 410 : 503;
    return NextResponse.json(
      {
        ok: false,
        code: state === "sunset" ? "SITE_DISCONTINUED" : "SITE_UNDER_MAINTENANCE",
        message:
          state === "sunset"
            ? "Website telah dihentikan otomatis oleh sistem setelah melewati masa maintenance 7 hari."
            : "Website sedang dalam maintenance serius. Seluruh endpoint dinonaktifkan sementara.",
      },
      { status },
    );
  }

  if (pathname !== "/") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
