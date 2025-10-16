import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import { readBodyBuffer } from '@/shared/proxy/body';
import { ACCESS_TOKEN_COOKIE, API_BASE_URL, REFRESH_TOKEN_COOKIE } from '@/shared/proxy/constants';
import {
  buildAuthCookieHeader,
  buildProxyHeaders,
  pickTokensFromSetCookie,
} from '@/shared/proxy/headers';
import { guardHttpMethod } from '@/shared/proxy/methodGuard';
import { buildBackendUrlForBff } from '@/shared/proxy/url';

// 원요청 시도한다.
async function forwardOnce(req: Request, cookieHeader?: string, bodyBuf?: ArrayBuffer) {
  const backendURL = buildBackendUrlForBff(req);
  const headers = buildProxyHeaders(req, { cookieHeader });
  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : (bodyBuf ?? (await req.arrayBuffer()));
  return fetch(backendURL, { method: req.method, headers, body });
}

async function handler(req: Request, path: string) {
  // HTTP 메서드가 허용된 집합에 포함되어 있는지 검사
  const methodError = guardHttpMethod(req);
  if (methodError) return methodError;

  // 바디를 1회만 읽어 재사용
  const bodyBuf = await readBodyBuffer(req);

  // 1) 현 쿠키로 원요청
  // Next.js 서버 환경의 Cookie 헤더 문자열만든다.
  const cookieHeader = buildAuthCookieHeader();
  // 원요청
  const res = await forwardOnce(req, cookieHeader, bodyBuf);

  if (res.status !== 401) {
    const payload = await res.arrayBuffer(); // 응답 body를 ArrayBuffer로 읽음 (원본 그대로)
    const out = new NextResponse(payload, { status: res.status });

    //백엔드 응답에 Set-Cookie가 있다면 그대로 클라이언트에 전달
    const sc = res.headers.get('set-cookie');
    if (sc) out.headers.append('set-cookie', sc);

    // 나머지 헤더들도 전부 복사
    res.headers.forEach((v, k) => {
      if (k.toLowerCase() !== 'set-cookie') out.headers.set(k, v);
    });
    return out;
  }

  // 2) 401 → refresh
  const refreshHeaders = new Headers();
  if (cookieHeader) refreshHeaders.set('cookie', cookieHeader);

  const refreshRes = await fetch(`${API_BASE_URL}/api/member/refresh`, {
    method: 'POST',
    headers: refreshHeaders,
  });

  if (!refreshRes.ok) {
    const expired = NextResponse.json(
      {
        success: false,
        code: 401,
        message: '세션이 만료되었습니다.',
      },
      { status: 401 },
    );

    expired.cookies.set(ACCESS_TOKEN_COOKIE, '', { maxAge: 0, path: '/' });
    expired.cookies.set(REFRESH_TOKEN_COOKIE, '', { maxAge: 0, path: '/' });
    return expired;
  }

  // 3) refresh 성공 → 새 쿠키 반영 후 재시도
  const setCookie = refreshRes.headers.get('set-cookie');
  let retryCookieHeader = cookieHeader; // 우선 기존 쿠키헤더로 초기화
  if (setCookie) {
    // 백엔드가 새 쿠키 줬다면
    const parsed = pickTokensFromSetCookie(setCookie); // access_token, refresh_token만 파싱해서 꺼냄
    const cookieStore = cookies();
    const access = parsed.get(ACCESS_TOKEN_COOKIE) ?? cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
    const refresh =
      parsed.get(REFRESH_TOKEN_COOKIE) ?? cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
    // 최종 쿠키헤더 문자열 조립
    retryCookieHeader = [
      access && `${ACCESS_TOKEN_COOKIE}=${access}`,
      refresh && `${REFRESH_TOKEN_COOKIE}=${refresh}`,
    ]
      .filter(Boolean)
      .join('; ');
  }

  // 재시도
  const retry = await forwardOnce(req, retryCookieHeader, bodyBuf);
  const retryPayload = await retry.arrayBuffer();
  const out = new NextResponse(retryPayload, { status: retry.status });

  if (setCookie) out.headers.append('set-cookie', setCookie);
  retry.headers.forEach((v, k) => {
    if (k.toLowerCase() !== 'set-cookie') out.headers.set(k, v);
  });

  return out;
}

export const GET = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path.join('/'));
export const POST = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path.join('/'));
export const PUT = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path.join('/'));
export const PATCH = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path.join('/'));
export const DELETE = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path.join('/'));
