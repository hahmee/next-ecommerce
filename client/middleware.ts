   import { NextRequest, NextResponse } from 'next/server';

import { MemberRole } from '@/entities/member/consts/MemberRole';

// 여기에 포함되지 않은 모든 경로는 비로그인 사용자도 접근할 수 있음
const AUTH_REQUIRED_ROUTES = ['/admin', '/shopping', '/review'];
const BACKEND_URL = process.env.BACKEND_URL!;

// 특정 역할을 요구하는 경로와 역할 매핑
const ADMIN_ROLES: MemberRole[] = [MemberRole.ADMIN, MemberRole.MANAGER, MemberRole.DEMO];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 현재 경로가 로그인이 필수인 경로인지 확인
  const isAuthRequired = AUTH_REQUIRED_ROUTES.some((route) => pathname.startsWith(route));

  // 로그인이 필수가 아닌 경로(메인, 상품 목록/상세 등)는 모두 통과
  if (!isAuthRequired) {
    return NextResponse.next();
  }

  // --- 이하 로직은 로그인이 "필수"인 경로에만 적용 ---

  const accessToken = request.cookies.get('access_token')?.value;
  const refreshToken = request.cookies.get('refresh_token')?.value;

  // 보호된 경로에 접근하는데 토큰이 없는 경우 -> 로그인 페이지로
  if (!refreshToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname); // 다시 돌아갈 구조
    return NextResponse.redirect(loginUrl);
  }

  // 토큰이 있는 경우, 유효성 및 역할 검사
  try {
    const response = await fetch(`${BACKEND_URL}/api/me`, {
      headers: { Cookie: `access_token=${accessToken}` },
      cache: 'no-store', // 캐시에 저장하지 않는다. -> 바로 최신 상태를 보여준다.
    });

    if (!response.ok) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    const data = await response.json();

    const { roleNames } = data.data as { roleNames: MemberRole[] };

    // 관리자 페이지에 접근하는 경우, 역할 확인
    if (pathname.startsWith('/admin')) {
      const isAuthorized = roleNames?.some((role) => ADMIN_ROLES.includes(role));
      if (!isAuthorized) {
        return NextResponse.redirect(new URL('/error', request.url));
      }
    }

    // 검증 통과 시 요청 그대로 진행
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
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
    '/((?!apis|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|sitemap-\\d+\\.xml|login|signup|order/success).*)',
  ],
};
