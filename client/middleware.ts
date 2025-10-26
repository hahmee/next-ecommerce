import { NextRequest, NextResponse } from 'next/server';

const AUTH_REQUIRED = ['/admin', '/shopping', '/review'];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const needAuth = AUTH_REQUIRED.some((p) => pathname.startsWith(p));
  if (!needAuth) return NextResponse.next();

  const refresh = req.cookies.get('refresh_token')?.value;

  if (!refresh) {
    const url = new URL('/login', req.url);
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // refresh 있으면 무조건 통과 (여기서 /api/me 호출/역할 검사/리다이렉트 금지)
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|sitemap-\\d+\\.xml|login|signup|order/success).*)',
  ],
};
