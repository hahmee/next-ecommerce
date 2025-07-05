import { serverFetcher } from "src/utils/fetcher/serverFetcher";

export const fetcher = async <T = any>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  console.log('[WHERE]', typeof window, typeof document, globalThis?.window);

  const isServer = typeof window === 'undefined';
  if (isServer) { // 서버 컴포넌트에서 요청한 fetch (SSR)
    console.log('serverFetcher')
    return serverFetcher<T>(url, options); // 브라우저x, node.js서버에서 실행
  }else {
    console.log('[CLIENT]', 'clientFetcher');
  }

  //CSR
  const res = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  const json = await res.json().catch(() => ({}));

  if (res.status === 401) {
    const refreshRes = await fetch('/api/member/refresh', {
      method: 'POST',
      credentials: 'include', //브라우저가 알아서 쿠키 보냄
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
