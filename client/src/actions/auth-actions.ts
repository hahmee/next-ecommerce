'use server';
import { redirect } from 'next/navigation';
import {setCookie} from "@/utils/cookieUtil";

// export const login = async (prevState: any, formData: FormData) => {
export default async (prevState: any, formData: FormData) => {
  const email = formData.get('email');
  const password = formData.get('password');
  let shouldRedirect = false;

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        username: email as string,
        password: password as string,
      })
    });
    const result = await res.json();
    if (!res?.ok) {
      console.log('아이디와 비밀번호가 일치하지 않습니다.');
      return {message: '아이디와 비밀번호가 일치하지 않습니다.'};
    } else {
      shouldRedirect = true;
      setCookie('member', JSON.stringify(result), 1);
    }

  }catch (error) {
    console.error(error);
    return {message: null};
  }

  if (shouldRedirect) {
    redirect('/'); // try/catch문 안에서 X
  }
  return {message: null};

};
