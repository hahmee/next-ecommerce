'use server';
import {redirect} from 'next/navigation';
import {setCookie} from "@/utils/cookieUtil";


export default async (prevState: any, formData: FormData) => {

  if (!formData.get('email') || !(formData.get('email') as string)?.trim()) {
    return { message: 'no_email' };
  }
  if (!formData.get('password') || !(formData.get('password') as string)?.trim()) {
    return { message: 'no_password' };
  }

  const email = formData.get('email');
  const password = formData.get('password');
  let shouldRedirect = false;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/member/login`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        username: email as string,
        password: password as string,
      })
    });

    const data = await response.json();

    if (data.error) { //에러가 있을 때
      console.log('아이디와 비밀번호가 일치하지 않습니다.');
      return { message: 'no_authorized' };

    } else {
      setCookie('member', JSON.stringify(data), 1);
      shouldRedirect = true;
    }

  }catch (error) {
    console.error(error);
    return { message: null };
  }

  if (shouldRedirect) {
    redirect('/'); // try/catch문 안에서 X
  }
  return { message: null };

};
