// 클라이언트 전용 fetcher (쿠키는 자동 포함)

export const clientFetcher = async <T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  // const finalUrl = path; // 브라우저 기준 요청 (e.g. /api/me)
  const finalUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;

  console.log('clientFetcher')
  let res = await fetch(finalUrl, {
    ...options,
    credentials: 'include',
  });

  let json: any = await res.json().catch(() => ({}));

  if (res.status === 401) {
    const refresh = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (refresh.ok) {
      res = await fetch(finalUrl, {
        ...options,
        credentials: 'include',
      });
      json = await res.json().catch(() => ({}));
    }
  }

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || '요청 실패');
  }

  return json.data;
};
