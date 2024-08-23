'use server'

import {cookies} from "next/headers";

export const  setCookie = async (name: string, value: string, days = 1) => {
    const expires = new Date();
    expires.setUTCDate(expires.getUTCDate() + days);
    return cookies().set(name, value, {expires: expires}); // 브라우저에 쿠키를 심어주는 것 (expire 생성하기)
};
