// import {NextFetchEvent, NextRequest, NextResponse} from "next/server";
// import {getCookie} from "@/utils/cookieUtil";
// //하고싶은 일
// //미들웨어에서 Authorization실어서 보내는 방법은 없는거야?
// //그리고 jwt 만료됐을 때 백엔드에 보내는 방법은 ?
import {NextFetchEvent, NextRequest, NextResponse} from "next/server";
import {getCookie} from "@/utils/cookieUtil";


function checkAuthentication(req: NextRequest): boolean {
  const member = getCookie("member");
  if( member )  {
    return true;
  }else {
    return false;
  }
  // 실제 인증 로직 구현
}

export async function middleware(req: NextRequest, event: NextFetchEvent) {

  console.log('middleware', req.method, req.url);

  const isAuthenticated = checkAuthentication(req);
  if (!isAuthenticated) {
    console.log('User not authenticated, redirecting to login');
    return NextResponse.redirect('/login');
  }

  return NextResponse.next();

}

export const config = {
  matcher: ['/profile','/admin',],
}