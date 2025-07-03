// utils/getUserInfo.ts
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

//SSR 용 getUserInfo
//  access_token 있으면 API 요청
//  없으면 null

export async function getUserInfo() {
  console.log('getUserInfo')
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return null;

  const res = await fetch(`${BACKEND_URL}/api/me`, {
    headers: {
      cookie: `access_token=${accessToken}`,
    },
    cache: "no-store",
  });

  if (!res.ok) return null;
  return await res.json();
}



// import { cookies } from 'next/headers';
//
// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
//
// // 요청 함수
// const requestMe = async (token: string) => {
//   return await fetch(`${BACKEND_URL}/api/me`, {
//     headers: {
//       cookie: `access_token=${token}`,
//     },
//     // cache: 'force-cache',
//     cache: 'no-store'
//   });
// };
//
//
// // access_token 있으면 API 요청
// //        └── 없으면 null
// export async function getUserInfo() {
//   const cookieStore = cookies();
//   const accessToken = cookieStore.get('access_token')?.value;
//   const refreshToken = cookieStore.get('refresh_token')?.value;
//
//   // 1. 둘 다 없으면 로그인 상태 아님
//   if (!accessToken && !refreshToken) {
//     return null;
//   }
//
//   // 2. accessToken 있으면 우선 /api/me 요청 시도
//   if (accessToken) {
//     const response = await requestMe(accessToken);
//
//     if (response.ok) return await response.json();
//
//     if (response.status !== 401) {
//       const text = await response.text();
//       throw new Error(`[getUserInfo] ${response.status}: ${text}`);
//     }
//
//     // 401이면 refresh 시도
//   }
//
//   // 3. (accessToken 만료) refreshToken이 있으면 /refresh 요청 시도
//   if (refreshToken) {
//     console.log('accessToken 만료')
//
//     const refreshRes = await fetch(`${BACKEND_URL}/api/member/refresh`, {
//       method: "POST",
//       headers: {
//         cookie: `refresh_token=${refreshToken}`,
//       },
//     });
//
//     if (!refreshRes.ok) {
//       console.log('[getUserInfo] 토큰 재발급 실패');
//       return null;
//     }
//
//     // 서버가 set-cookie로 access_token 갱신해줌
//     // (HttpOnly 쿠키는 JS 접근 불가, 서버에서 자동 반영됨)
//
//     // 재시도 없이 끝냄 → 다음 SSR 요청부터 access_token 포함됨
//     console.log('[getUserInfo] access_token 재발급 완료');
//     return null;
//   }
//
//
//   // 4. 모든 경우 실패 시
//   return null;
// }
