// src/shared/http/serverFetcher.ts

'use server';

import { cookies } from 'next/headers';

/**
 * serverFetcher는 SSR 서버 컴포넌트에서 fetch 요청 시 사용하는 유틸
 *
 * 여기서는 accessToken 재발급(refresh)을 하지 않음
 * 이유:
 * - 재발급은 가능하지만 최신 쿠키는 사용 못함
 * - 서버 컴포넌트는 브라우저처럼 쿠키를 자동으로 갱신할 수 없음
 * - 서버가 accessToken을 재발급해도 그 쿠키는 브라우저가 받지 못함
 * - SSR에서 accessToken이 만료된 경우엔 그냥 실패로 처리하고 CSR에서 복구
 *
 * 즉, SSR 시점에 accessToken이 유효하면 fetch 성공,
 * 아니라면 throw Error로 에러를 던지고 CSR에서 /refresh → 원요청으로 복구 처리
 */
export const serverFetcher = async <T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const finalUrl = `${process.env.BACKEND_URL}${path}`;
  const cookieString = cookies().toString();

  const res = await fetch(finalUrl, {
    cache: 'no-store', // 기본 SSR
    ...options,
    headers: {
      ...(options.headers || {}),
      cookie: cookieString,
    },
  });

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json?.success === false) {
    console.log('ssr 요청 실패..');
    throw new Error(json?.message || '요청 실패'); //React Query의 onError 핸들러나 ErrorBoundary로 전파
  }

  return json.data;
};
