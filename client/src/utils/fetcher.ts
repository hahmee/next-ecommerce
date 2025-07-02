'use server';

import {cookies} from "next/headers";

export const fetcher = async <T = any>(
  path: string,
  options: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  } = {}
): Promise<T> => {

  const isServer = typeof window === 'undefined';

  const finalUrl = isServer
    ? `${process.env.NEXT_PUBLIC_BASE_URL}${path}` // ex: http://localhost:3000/api/me
    : path;


  const res = await fetch(finalUrl, {
    ...options,
    ...(isServer
      ? {// SSR 요청 - 자동으로 BFF(route.ts) 내부에서 쿠키 처리
        headers: {
          cookie: cookies().toString()
        },
      }
      : { //CSR 요청
        credentials: 'include', // 브라우저가 쿠키를 route.ts로 보냄
      }),
  });
  const json = await res.json().catch(() => ({}));

  //json {
  //   success: true,
  //   code: 0,
  //   message: 'Ok',
  //   data: { email: 'user1@aaa.com', nickname: 'USER1', roles: [ 'ADMIN' ] }
  // }

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || '요청 실패');
  }

  return json.data;
};
