'use server';

import { cookies } from 'next/headers';

export const serverFetcher = async <T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  console.log('serverFetcher')
  const finalUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
  const cookieString = cookies().toString();

  const res = await fetch(finalUrl, {
    ...options,
    headers: {
      ...(options.headers || {}),
      cookie: cookieString,
    },
    cache: 'no-store', //기본 SSR
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json?.success === false) {
    console.log('요청실패..')
    throw new Error(json?.message || '요청 실패');
  }

  return json.data;
};
