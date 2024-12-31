'use server'

import { cookies } from 'next/headers'

export async function setCookie(key: string, value: string, days = 1) {

    //쿠키 다시 세팅
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + days);

    cookies().set(key, value, {expires: expires});
}

export async function getCookie(key: string) {
    const cookieValue  = cookies().get(key)?.value;
    return cookieValue ? JSON.parse(cookieValue) : undefined;
}

export async function removeCookie(name: string) {
    cookies()?.delete(name);
};


