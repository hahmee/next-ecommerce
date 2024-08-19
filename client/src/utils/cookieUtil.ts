
import {cookies} from "next/headers";
import {Member} from "@/interface/Member";



export const  setCookie = (name: string, value: string, days = 1) => {
  const expires = new Date();
  expires.setUTCDate(expires.getUTCDate() + days);
  return cookies().set(name, value, {expires: expires}); // 브라우저에 쿠키를 심어주는 것 (expire 생성하기)
};

//
// export const getCookie = async (name: string) => {
//   const memberInfo = cookies()?.get(name)?.value;
//
//   if(memberInfo) {
//     return JSON.parse(memberInfo); // 값이 무조건 할당되었다고 전달
//   }else {
//     return undefined;
//   }
// };

export const getCookie = (name: string): Member | undefined => {
  const memberInfo =  cookies()?.get(name)?.value;

  if(memberInfo) {
    return JSON.parse(memberInfo); // 값이 무조건 할당되었다고 전달
  }else {
    return undefined;
  }
};
//TS2322: Type (name: string) => any is not assignable to type

export const removeCookie = (name: string) => {
  cookies()?.delete(name);
};
