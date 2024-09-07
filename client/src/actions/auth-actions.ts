'use server';
import {redirect} from 'next/navigation';
import {DataResponse} from "@/interface/DataResponse";
import {Member} from "@/interface/Member";
import {cookies} from "next/headers";


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
    const response = await fetch(`/api/member/login`, {
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

    console.log('data...!!!', data);
   if(data.code != 0) { //에러있는 상황
     return { message: data.message };
   }else{
     // await setCookie('member', JSON.stringify(data.data), 1);

     // setCookie("member", data.data,{
     //     path: '/',
     //     maxAge: 60 * 60 * 24, //1일?
     //     httpOnly: false,
     //     // secure: process.env.NODE_ENV === 'production',
     //     sameSite: 'lax',
     // });

     const expires = new Date();
     expires.setUTCDate(expires.getUTCDate() + 1);
     cookies().set("member", JSON.stringify(data.data), {expires: expires, httpOnly: false});

     // await fetch("http://localhost:3000/api/auth", {
     //   method: "POST",
     //   body: JSON.stringify(data.data),
     // });

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
