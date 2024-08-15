"use server";

import {redirect} from "next/navigation";
import {setCookie} from "@/utils/cookieUtil";

export default async (prevState: any, formData: FormData) => {
  console.log('formData', formData);

  if (!formData.get('email') || !(formData.get('email') as string)?.trim()) {
    return { message: 'no_email' };
  }
  if (!formData.get('nickname') || !(formData.get('nickname') as string)?.trim()) {
    return {message: 'no_name'};
  }
  if (!formData.get('password') || !(formData.get('password') as string)?.trim()) {
    return { message: 'no_password' };
  }

  formData.set('social', 'false');
  formData.set('roleNames', 'USER');

  let shouldRedirect = false;
  try {
    //회원가입
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/register`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
    const data = await response.json();

    if (response.status === 403) {
      if(data.msg === "Email duplicated") {
        return {message: 'email_exists'};
      }else {
        return {message: 'nickname_exists'};
      }
    }

    shouldRedirect = true;

  } catch (err) {
    console.error(err);
    return {message: 'unknown_error'};
  }

  if (shouldRedirect) {
    redirect('/login');
  }
  return {message: null};
};