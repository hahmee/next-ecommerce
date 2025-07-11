// utils/getUserInfo.ts
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.BACKEND_URL!;

//SSR 용 getUserInfo
//access_token 있으면 API 요청
//없으면 null

export async function getUserInfo() {
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

  const data = await res.json();
  return await data.data;
}
