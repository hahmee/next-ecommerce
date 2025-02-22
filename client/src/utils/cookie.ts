'use server'

import { cookies } from 'next/headers'

export async function setCookie(key: string, value: string, days = 1) {

    //쿠키 다시 세팅
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + days);

    // cookies().set(key, value, {expires: expires});
    //변경이유: 토스 페이먼츠같이 외부에서 내부로 리다이렉트될 때 쿠키 올바르게 전송되도록 sameSite none 설정
    cookies().set(key, value, {
        expires: expires,
        sameSite: 'none', // 외부 리다이렉트에서도 쿠키 전송을 허용
        secure: true,  // 배포환경에서는 true, 로컬에서는 false
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


