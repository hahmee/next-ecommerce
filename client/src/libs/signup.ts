"use server";

import {redirect} from "next/navigation";
import {DataResponse} from "@/interface/DataResponse";
import {Member} from "@/interface/Member";

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
      method: "POST",
      body: formData,
      credentials: 'include',
    })
    const data:DataResponse<Member> = await response.json();

    console.log('dataaaaaaaa', data);
    console.log('response', response.status);

    if(!response.ok) {
      return { message: data.message };
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