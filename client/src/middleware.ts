// import {NextFetchEvent, NextRequest, NextResponse} from "next/server";
// import {getCookie} from "@/utils/cookieUtil";
// //하고싶은 일
// //미들웨어에서 Authorization실어서 보내는 방법은 없는거야?
// //그리고 jwt 만료됐을 때 백엔드에 보내는 방법은 ?
import {NextFetchEvent, NextRequest} from "next/server";

export async function middleware(req: NextRequest, event: NextFetchEvent) {

    // 8080 찾아서 넣으면 되자나 ..?
    //  console.log('middleware', req.method, req.url);
//     // const member = getCookie("member");
//     //
//     // const requestHeaders = new Headers(req.headers);
//     // requestHeaders.set('Authorization', `Bearer ${member.accessToken}`);
//     //
//     // console.log('requestHeadersrequestHeadersrequestHeaders', requestHeaders);
//     // const response = NextResponse.next({
//     //     request: {
//     //         // New request headers
//     //         headers: requestHeaders,
//     //     },
//     // })
//
//     // Set a new response header `x-hello-from-middleware2`
//     // response.headers.set('x-hello-from-middleware2', 'hello')
//     // return response
//   // try {
//   //   const member = getCookie("member");
//   //   console.log('zzzzz', req.method, req.url)
//   //   const {pathname,port} = req.nextUrl; //현재 주소
//   //   console.log('현재주소', port);
//   //   // console.log('pathname------------------', req.headers);
//   //   // console.log('event', event.request);
//   //
//   //   //헤더에 Authorization에 AccessToken 실어줌
//   //   const requestHeaders = new Headers(req.headers);
//     // requestHeaders.set('Authorization', `Bearer ${member.accessToken}`);
//
//
//
//     //
//   //   //
//   //   const member = getCookie("member");
//   //   if (!member) {
//   //     // Authentication failed
//   //     console.log('Member NOT FOUND');
//   //     return NextResponse.redirect(new URL("/login", req.url)); // Redirect to login
//   //   }
//   //
//   //   //login, signup이 아닐때만 헤더를 설정해서 보냄
//   //   const requestHeaders = new Headers(req.headers);
//   //   // Add new request headers (AccessToken설정해줌)
//   //   requestHeaders.set('Authorization', `Bearer ${member.accessToken}`);
//   //
//   //
//   //   // Authentication successful, continue to the requested page
//   //   return NextResponse.next({
//   //     request: {
//   //       headers: requestHeaders,
//   //     }
//   //   });
//   // } catch (error) {
//   //   // Handle authentication errors
//   //   console.error("Authentication error:", error);
//   //   return NextResponse.json(
//   //       { success: false, message: "An error occurred during authentication." },
//   //       { status: 401 }
//   //   );
//   // }
}
//
// // See "Matching Paths" below to learn more
export const config = {
  matcher: ['/profile','/','/login'],
}