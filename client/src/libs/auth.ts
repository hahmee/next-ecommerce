import { cookies } from 'next/headers';

export async function getUserInfo() {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('access_token')?.value;

  console.log("[getUserInfo] 호출됨!", accessToken);

  if (!accessToken) return null;

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/me`, {
      headers: {
        cookie: `access_token=${accessToken}`,
      },
      cache: "force-cache", //  캐시에 저장 -> 동일 요청 캐시 값 사용
    });

    if (!response.ok) return null;

    return await response.json()

  } catch (error) {
    console.error('❌ [getUserInfo] 유저 정보 불러오기 실패:', error);
    return null;
  }
}
