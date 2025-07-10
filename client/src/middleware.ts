// middleware.ts

import { NextRequest, NextResponse } from 'next/server';
import { MemberRole } from '@/types/memberRole';

// 1. 로그인이 "필수"인 경로 목록 정의
// 여기에 포함되지 않은 모든 경로는 비로그인 사용자도 접근할 수 있습니다.
const AUTH_REQUIRED_ROUTES = [
  '/admin',
  '/shopping',
  '/review',
  '/payment',
  '/order',
  '/admin', // 관리자 페이지도 일단 로그인은 필수
];

// 특정 역할을 요구하는 경로와 역할 매핑
const ADMIN_ROLES = ['ROLE_ADMIN', 'ROLE_MANAGER'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // // 2. 현재 경로가 로그인이 필수인 경로인지 확인
  // const isAuthRequired = AUTH_REQUIRED_ROUTES.some(route => pathname.startsWith(route));
  //
  // // 3. 로그인이 필수가 아닌 경로(메인, 상품 목록/상세 등)는 모두 통과
  // if (!isAuthRequired) {
  //   return NextResponse.next();
  // }

  // --- 이하 로직은 로그인이 "필수"인 경로에만 적용됩니다 ---

  // const accessToken = request.cookies.get('access_token')?.value;
  //
  // // 4. 보호된 경로에 접근하는데 토큰이 없는 경우 -> 로그인 페이지로
  // if (!accessToken) {
  //   const loginUrl = new URL('/login', request.url);
  //   loginUrl.searchParams.set('redirect', pathname);
  //   return NextResponse.redirect(loginUrl);
  // }
  //
  // // 5. 토큰이 있는 경우, 유효성 및 역할 검사 (이전 로직과 동일)
  // try {
  //   const response = await fetch(new URL('/apis/auth/me', request.nextUrl.origin), {
  //     headers: { Cookie: `access_token=${accessToken}` },
  //   });
  //
  //   if (!response.ok) {
  //     return NextResponse.redirect(new URL('/login', request.url));
  //   }
  //
  //   const { roles } = (await response.json()) as { roles: string[] };
  //
  //   // 6. 관리자 페이지에 접근하는 경우, 역할 확인
  //   if (pathname.startsWith('/admin')) {
  //     const isAuthorized = roles?.some(role => ADMIN_ROLES.includes(role));
  //     if (!isAuthorized) {
  //       return NextResponse.redirect(new URL('/error/forbidden', request.url));
  //     }
  //   }
  //
  //   // 7. 검증 통과 시 요청 그대로 진행
  //   return NextResponse.next();
  // } catch (error) {
  //   console.error('Middleware error:', error);
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }
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
