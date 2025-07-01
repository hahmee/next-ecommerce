import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { orderId: string } }) {
  const orderId = params.orderId;
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  console.log('accessToken',accessToken)
  console.log('refreshToken',refreshToken)

  // 1. 원 요청
  let res = await fetch(`${process.env.BACKEND_URL}/api/orders/list/${orderId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (res.status !== 401) {
    return NextResponse.json(await res.json());
  }

  // 2. refresh 요청
  const refreshRes = await fetch(`${process.env.BACKEND_URL}/api/member/refresh`, {
    method: "POST",
    headers: {
      cookie: `refresh_token=${refreshToken}`,
    },
  });

  if (!refreshRes.ok) {
    return NextResponse.json({ success: false }, { status: 401 });
  }

  const setCookie = refreshRes.headers.get("set-cookie");
  const newAccessToken = setCookie?.match(/access_token=([^;]+)/)?.[1];

  console.log('setCookie',setCookie)
  // 3. 재요청
  const retryRes = await fetch(`${process.env.BACKEND_URL}/api/orders/list/${orderId}`, {
    headers: {
      Authorization: `Bearer ${newAccessToken}`,
    },
  });

  const response = NextResponse.json(await retryRes.json());
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }
  return response;
}
