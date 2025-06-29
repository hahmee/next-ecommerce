// utils/fetcher.ts

export const fetcher = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const res = await fetch(url, {
    ...options,
    credentials: "include", // 자동 쿠키 전송 (HTTPOnly 인증을 위해 필수)
  });

  // accessToken 만료 시 → /refresh 요청
  if (res.status === 401) {
    const refreshRes = await fetch("/api/member/refresh", {
      method: "POST",
      credentials: "include",
    });

    if (refreshRes.ok) {
      const retry = await fetch(url, {
        ...options,
        credentials: "include",
      });

      if (!retry.ok) {
        const retryErr = await retry.json().catch(() => ({}));
        throw new Error(retryErr.message || "요청 실패");
      }

      return retry.json();
    }

    throw new Error("로그인이 만료되었습니다.");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "서버 오류");
  }

  return res.json();
};
