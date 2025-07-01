"use server";

//만약 acc가 만료됐다? 401 응답
// 프론트에서 credentials: "include", 해야함
// 재시도
//그럼 서버 컴포넌트는..?

import { cookies } from 'next/headers';

//브라우저x, node.js서버에서 실행 - 따라서 쿠키 자동으로 보내지 X
//직접 쿠키 꺼내서 헤더에 넣어줘야함
export const serverFetcher = async <T = any>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const cookieStore = cookies(); // SSR 환경에서만 동작
  const token = cookieStore.get('access_token')?.value;

  if (!token) {
    throw new Error('인증 토큰이 없습니다.');
  }

  const makeRequest = async (accessToken: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}${url}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Cookie: `access_token=${accessToken}`,
      },
    });

    const json = await res.json().catch(() => ({}));

    return { res, json };
  };

  let { res, json } = await makeRequest(token);

  // accessToken 만료 → refresh token으로 재발급 시도
  // 문제점: 새 토큰을 받아도, cookies()는 변하지 않음
  // cookie -> SSR 요청 시작 시점의 값만 유지
  // 여전히 만료된 토큰값
  // 따라서 BFF API ROUTE
  if (res.status === 401) {
    const refreshRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/member/refresh`, {
      method: "POST",
      headers: {
        Cookie: `access_token=${token}`,
      },
    });

    if (refreshRes.ok) {
      // refresh가 성공했으면 재요청
      const refreshedCookie = cookies().get("access_token")?.value; //항상 실패 or 예전 값
      if (refreshedCookie) {
        const retry = await makeRequest(refreshedCookie);
        res = retry.res;
        json = retry.json;
      }
    } else {
      throw new Error(json.message || "로그인 만료");
    }
  }

  if (!res.ok || !json.success) {
    throw new Error(json.message || "서버 오류");
  }

  return json.data;

};
