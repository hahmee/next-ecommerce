// import {NextFetchEvent, NextRequest, NextResponse} from "next/server";
// import {getCookie} from "@/utils/cookieUtil";
// //하고싶은 일
// //미들웨어에서 Authorization실어서 보내는 방법은 없는거야?
// //그리고 jwt 만료됐을 때 백엔드에 보내는 방법은 ?
import {NextFetchEvent, NextRequest, NextResponse} from "next/server";
import {getCookie} from "@/utils/getCookieUtil";
import {MemberRole} from "@/types/memberRole";


//권한에 따라 접근 막기


export async function middleware(request: NextRequest, event: NextFetchEvent) {

  const { pathname } = request.nextUrl;
  const member = getCookie("member");

  // console.log('middleware-----------------------------------', request.method, request.url);

  // if (!member) { //로그인 안되어있으면
  //   console.log('User not authenticated, redirecting to login');
  //   return NextResponse.redirect(new URL('/login', request.url));
  // }else{
  //   const response = NextResponse.next();
  //   response.cookies.set("accessToken", result.accessToken);
  //   setCookie('member', JSON.stringify(newCookie), 1);
  //   return response;
  // }

  if(pathname.startsWith("/admin") && !(member?.roleNames?.includes(MemberRole.ADMIN)) || (member?.roleNames?.includes(MemberRole.MANAGER))) {
    //오직 MANAGER과 ADMIN만 들어갈 수 있다
    // return NextResponse.redirect(new URL('/', request.url)); // 접근 할 수 없는 페이지입니다. 만들어서 넣기
    return Response.json(
        {success: false, message: "authentication failed"},
        {status: 401}
    );


  }

  return NextResponse.next();

}

export const config = {
  matcher: ['/profile','/admin/:path*',],
}