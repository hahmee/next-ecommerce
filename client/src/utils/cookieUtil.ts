import {cookies} from "next/headers";

export const  setCookie = (name: string, value: string, days = 1) => {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + days);
  return cookies().set(name, value, {expires: expires}); // 브라우저에 쿠키를 심어주는 것 (expire 생성하기)
};
export const getCookie = (name: string) => {
  return JSON.parse(cookies()?.get(name)?.value!); // 값이 무조건 할당되었다고 전달
};
//TS2322: Type (name: string) => any is not assignable to type

export const removeCookie = (name: string) => {
  cookies().delete(name);
};
