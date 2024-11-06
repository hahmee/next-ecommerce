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

    console.log('data..', data);
    //data.. {
    //   success: false,
    //   code: 401,
    //   message: 'DUPLICATED_EMAIL - 이미 사용하고 있는 이메일입니다.'
    // }
    console.log('response..', response.status);  //백엔드에서 보내는 에러코드 401

    if(!response.ok) { //백엔드에서 에러코드를 보냈다면

      console.log('백엔드 오류 뜨면 이게 실행됨.')
      return { message: data.message };
    }

    shouldRedirect = true;

  } catch (err) {
    console.error(err);
    return {message: '알 수 없는 에러입니다.'};
  }

  if (shouldRedirect) {
    redirect('/login');
  }

  return {message: null};
};