


import {cookies} from "next/headers";
import {Member} from "@/interface/Member";

export const getCookie = (name: string): Member | undefined => {
  const cookieStore = cookies();

  const memberInfo = cookieStore?.get(name)?.value;

  if(memberInfo) {
    return JSON.parse(memberInfo); // 값이 무조건 할당되었다고 전달
  }else {
    return undefined;
  }
};

export const removeCookie = (name: string) => {
  cookies()?.delete(name);
};
