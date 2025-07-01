import {NextRequest} from "next/server";


// 권한에 따라 접근 막기
export async function middleware(request: NextRequest) {

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
