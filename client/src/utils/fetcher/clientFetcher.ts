// 클라이언트 전용 fetcher (쿠키는 자동 포함)

import {SessionExpiredError} from "@/libs/error/errors";

// accessToken refresh 해줌
export const clientFetcher = async <T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {

  const finalUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
  console.log('path', path)
  let res = await fetch(finalUrl, {
    ...options,
    credentials: 'include',
  });

  let json: any = await res.json().catch(() => ({}));

  if (res.status === 401) { // client에서 accessToken 복구한다.
    console.log('accessToken 만료됨 → refresh 시도');
    const refresh = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/refresh`, {
      method: 'POST',
      credentials: 'include', // 쿠키 포함
    });

    console.log('🔁 refresh 응답 상태:', refresh.status);

    if (refresh.ok) {
      // accessToken 재발급 성공 → 재요청
      res = await fetch(finalUrl, {
        ...options,
        credentials: 'include',
      });
      json = await res.json().catch(() => ({}));
    } else {   // refreshToken도 만료 → 로그아웃 처리
      console.log('❌ refreshToken 만료 → 로그아웃 처리');
      throw new SessionExpiredError(); // SessionExpiredError 에러 발생
    }
  }

  if (!res.ok || json?.success === false) {
    throw new Error(json?.message || '요청 실패');
  }

  return json.data;
};
