// utils/serverFetcher.ts
import { cookies } from 'next/headers';

export const serverFetcher = async <T = any>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const token = cookies().get('access_token')?.value;

  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Cookie: `access_token=${token}`,
    },
    cache: 'no-store', // SSR에선 캐시 피하기
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || !json.success) {
    throw new Error(json.message || '서버 오류');
  }

  return json.data;
};
