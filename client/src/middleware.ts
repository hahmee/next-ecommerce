import { NextRequest, NextResponse } from "next/server";
import { MemberRole } from "@/types/memberRole";

// 쿠키에서 "member"를 읽기
function getCookie(request: NextRequest, cookieName: string) {
  const cookie = request.cookies.get(cookieName);
  return cookie ? JSON.parse(cookie.value) : null;
}

// 권한에 따라 접근 막기
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const member = getCookie(request, "member");

  // 로그인되지 않은 경우 로그인 페이지로 리다이렉션
  // if (!member) {
  //   console.log('User not authenticated, redirecting to login');
  //   return NextResponse.redirect(new URL('/login', request.url)); // 로그인 페이지로 리다이렉션
  // }

  // 관리자와 매니저만 접근 가능
  if (
      pathname.startsWith("/admin") &&
      !(member?.roleNames?.includes(MemberRole.ADMIN)) &&
      !(member?.roleNames?.includes(MemberRole.MANAGER))
  ) {

    return NextResponse.redirect(new URL('/error', request.url)); // 에러 페이지로 리다이렉션

    // return NextResponse.json(
    //     { success: false, message: "authentication failed" },
    //     { status: 401 }
    // );
  }

  return NextResponse.next();
}

// config를 모든 페이지로 변경 (login, signup 제외)
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - apis (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - login and signup pages
     */
    '/((?!apis|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|login|signup).*)',
  ],
};
