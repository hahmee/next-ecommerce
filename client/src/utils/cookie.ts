'use server'

import { cookies } from 'next/headers'

export async function setCookie(key: string, value: string, days = 1) {

    //쿠키 다시 세팅
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + days);
    const isProduction = process.env.NEXT_PUBLIC_MODE === 'production';

    // cookies().set(key, value, {expires: expires});
    //변경이유: 토스 페이먼츠같이 외부에서 내부로 리다이렉트될 때 쿠키 올바르게 전송되도록 sameSite none 설정
    //배포환경에서는 cookie(member)값 제대로 가져와짐
    //하지만 이제 두번씩 결제되는 거 해결하면 됨
    cookies().set(key, value, {
        expires: expires,
        sameSite: isProduction ? 'none' : 'lax', // 외부 리다이렉트에서도 쿠키 전송을 허용
        secure: isProduction, // 로컬은 false
        path: '/',        // 전체 경로에 대해 쿠키 적용
    });

}

export async function getCookie(key: string) {
    const cookieValue  = cookies().get(key)?.value;
    return cookieValue ? JSON.parse(cookieValue) : undefined;
}

export async function removeCookie(name: string) {
    cookies()?.delete(name);
};


