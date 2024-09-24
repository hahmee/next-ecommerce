


import {cookies} from "next/headers";
import {Member} from "@/interface/Member";

export const getCookie = (name: string): Member | undefined => {
  const cookieStore = cookies();

  const memberInfo = cookieStore?.get(name)?.value;

  // console.log('memberInfo.....', memberInfo);
  if(memberInfo) {
    // return JSON.parse(JSON.stringify(memberInfo));
    return JSON.parse(memberInfo);
  }else {
    return undefined;
  }
};

export const removeCookie = (name: string) => {
  cookies()?.delete(name);
};
