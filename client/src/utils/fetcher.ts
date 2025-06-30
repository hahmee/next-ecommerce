import { serverFetcher } from "./serverFetcher";

export const fetcher = async <T = any>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const isServer = typeof window === 'undefined';

  if (isServer) {
    return serverFetcher<T>(url, options);
  }

  const res = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  const json = await res.json().catch(() => ({}));

  if (res.status === 401) {
    const refreshRes = await fetch('/api/member/refresh', {
      method: 'POST',
      credentials: 'include',
    });

    if (refreshRes.ok) {
      const retry = await fetch(url, {
        ...options,
        credentials: 'include',
      });

      const retryJson = await retry.json().catch(() => ({}));

      if (!retry.ok || !retryJson.success) {
        throw new Error(retryJson.message || '요청 실패');
      }

      return retryJson.data;
    }

    throw new Error(json.message || '로그인이 만료되었습니다.');
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || '서버 오류');
  }

  return json.data;
};
