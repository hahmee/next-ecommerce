import { NextRequest, NextResponse } from 'next/server';
import {cookies} from "next/headers";

export async function GET(req: NextRequest) {
  console.log('?????? profile API hit');
  const cookieStore = cookies();
  const accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  console.log('accessToken', accessToken);
  console.log('refreshToken', refreshToken);

  if(!accessToken || !refreshToken) {
    return NextResponse.json({ success: false, message: '인증 정보 없음' }, { status: 401 });
  }

  // 1. 원 요청
  let res = await fetch(`${process.env.BACKEND_URL}/api/me`, {
    headers: {
      cookie: `access_token=${accessToken}`,
    },
  });

  if (res.status !== 401) {
    const data = await res.json();
    console.log('data',data);
    console.log('??여기로 들어오는데? 제대로 됏는데?')
    return NextResponse.json(data); // { email: 'xxx@xxx.com', nickname: 'xxx', roles: [ 'ADMIN' ] }
  }


  // 2. refresh 요청 (accessToken 재발급 요청)
  const refreshRes = await fetch(`${process.env.BACKEND_URL}/api/member/refresh`, {
    method: "POST",
    headers: { // 여기 refresh token도 넣어야하지않아?
      cookie: `access_token=${accessToken}; refresh_token=${refreshToken}`,
    },
  });

  // accessToken 재발급 실패
  if (!refreshRes.ok) {
    return NextResponse.json({ success: false, message: 'accessToken 재발급 실패' }, { status: 401 });
  }

  //새로운 쿠키 (뭐가 set-cookie인거지?)
  const setCookie = refreshRes.headers.get("set-cookie");
  //새로운 accessToken?
  const newAccessToken = setCookie?.match(/access_token=([^;]+)/)?.[1];

  console.log('setCookie',setCookie)
  console.log('newAccessToken',newAccessToken)

  // 3. 재요청
  const retryRes = await fetch(`${process.env.BACKEND_URL}/api/me`, {
    headers: {
      cookie: `access_token=${newAccessToken}`,
    },
  });

  // 응답
  const response = NextResponse.json(await retryRes.json());

  //이게 왜 필요하지? 어차피 재발급되면 백엔드에서 httponlycookie로 세팅되잖아. 뭐지?
  if (setCookie) {
    response.headers.set("set-cookie", setCookie);
  }

  return response;
}