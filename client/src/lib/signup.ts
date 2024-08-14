"use server";

import {redirect} from "next/navigation";
import {signIn} from "@/auth";

export default async (prevState: any, formData: FormData) => {
  console.log('formData', formData);
  if (!formData.get('email') || !(formData.get('email') as string)?.trim()) {
    return {message: 'no_email'};
  }
  if (!formData.get('nickname') || !(formData.get('nickname') as string)?.trim()) {
    return {message: 'no_name'};
  }
  if (!formData.get('pw') || !(formData.get('pw') as string)?.trim()) {
    return {message: 'no_password'};
  }

  formData.set('social', 'false');
  formData.set('roleNames', 'USER');

  // if (!formData.get('image')) {
  //   return {message: 'no_image'};
  // }
  // formData.set('nickname', formData.get('name') as string);
  let shouldRedirect = false;
  try {


    console.log('??뭐냐');
    // const url = new URL('/api/member/register')
      const response = await fetch(`${process.env.AUTH_URL}/api/member/register`, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    })
    // console.log('/zzzzzz', response.json());
    if (response.status === 403) {
      return {message: 'user_exists'};
    }
    shouldRedirect = true;
    await signIn("credentials", {
      username: formData.get('id'),
      password: formData.get('password'),
      redirect: false,
    })
  } catch (err) {
    console.error(err);
    return {message: null};
  }

  if (shouldRedirect) {
    redirect('/login'); // try/catch문 안에서 X
  }
  return {message: null};
};