// src/shared/http/clientFetcher.ts

// src/shared/http/clientFetcher.ts

// 클라이언트 전용 fetcher (쿠키는 자동 포함)
import { SessionExpiredError } from '@/shared/lib/errors';

export const clientFetcher = async <T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  // BFF 경유
  const finalUrl = `/api/bff${path}`;
  console.log('clientFetcher');
  const res = await fetch(finalUrl, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
  });

  // BFF가 refresh 실패 시 401을 그대로 내려줌
  if (res.status === 401) {
    console.log('refresh 실패했습니다.');
    throw new SessionExpiredError();
  }

  const json: any = await res.json().catch(() => ({}));

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || '요청 실패');
  }

  return json.data;
};
