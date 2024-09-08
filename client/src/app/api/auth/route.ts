'use server'

import {cookies} from 'next/headers'
import {Member} from "@/interface/Member";

//쿠키 세팅
export async function POST(request: Request) {
    try {
        const originalCookie = await request.json();
        const {accessToken, refreshToken} = originalCookie as Member;
        if (accessToken && refreshToken) {

            //원래 쿠키값 가져오기
            const cookieStore = cookies();

            const memberCookie = cookieStore.get("member")?.value;
            console.log('memberCookie', memberCookie);

            const expires = new Date();
            expires.setUTCDate(expires.getUTCDate() + 1);

            if(memberCookie) { //로그인 아니고, 멤버 쿠키가 이미 있음
                //어세스, 리프레시 토큰 제외한 값은 유지
                const newCookie = {...JSON.parse(memberCookie), accessToken, refreshToken} as Member;
                cookies().set("member", JSON.stringify(newCookie), {expires: expires});

                //새로 세팅된 쿠키 값
                // return Response.json({member: newCookie });

            }else { //처음 로그인
                cookies().set("member", JSON.stringify(originalCookie), {expires: expires});
                //새로 세팅된 쿠키 값
                // return Response.json({member: originalCookie });
            }
            return new Response('Setting Cookie Completed', {
                status: 200,
            })


        } else {
            return new Response('Setting Cookie has a problem', {
                status: 400,
            })
        }
    }catch (error) {
        if(error instanceof Error) {
            return new Response(`Setting Cookie has a problem.. ${error.message}`, {
                status: 400,
            });
        }
    }

}


//쿠키 값 반환
export async function GET(request: Request) {
     try {
         const cookieStore = cookies();
         const member = cookieStore.get('member')?.value;

         if(!member) {
             return new Response('There is no cookie..', {
                 status: 400,
             })
         }

         return Response.json({member: JSON.parse(member) });

     }catch (error) {
         if(error instanceof Error){
             return new Response(`Failed to get a cookie..: ${error.message}`, {
                 status: 400,
             });
         }
     }


}