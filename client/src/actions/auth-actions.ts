'use server';
import {redirect} from 'next/navigation';
import {DataResponse} from "@/interface/DataResponse";
import {Member} from "@/interface/Member";
import {setCookie} from "@/utils/setCookieUtil";


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

    const data: DataResponse<Member> = await response.json();
    console.log(data);

   if(data.code != 0) { //에러있는 상황
     return { message: data.message };
   }else{
     await setCookie('member', JSON.stringify(data.data), 1);
     shouldRedirect = true;
   }

  }catch (error) {
    console.error(error);
    return { message: 'unknown_error' };
  }

  if (shouldRedirect) {
    redirect('/'); // try/catch문안에서 X
  }
  return { message: null };

};
