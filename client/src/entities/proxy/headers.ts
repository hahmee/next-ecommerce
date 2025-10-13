import { cookies } from 'next/headers';

import {ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE} from "@/entities/proxy/constants";


/** 인증 쿠키만 Cookie 헤더 문자열로 만든다 (BFF 전용) */
export function buildAuthCookieHeader() {
  const jar = cookies();
  const access = jar.get(ACCESS_TOKEN_COOKIE)?.value;
  const refresh = jar.get(REFRESH_TOKEN_COOKIE)?.value;

  return [
    access && `${ACCESS_TOKEN_COOKIE}=${access}`,
    refresh && `${REFRESH_TOKEN_COOKIE}=${refresh}`,
  ]
    .filter(Boolean) // undefined/null/빈값 제거
    .join('; ');
}

/**
 * 백엔드으로 보낼 헤더 정리 (host 제거, 필요시 cookie 주입)
 * 브라우저/클라이언트가 보낸 원본 헤더에는 프록시에 부적절하거나(Host),
 * 그대로 전달하면 위험/혼란을 줄 수 있는 값들(Cookie)이 있을 수 있음
 * * */
export function buildProxyHeaders(
  req: Request,
  opts?: { cookieHeader?: string; dropCookies?: boolean },
) {
  const headers = new Headers(req.headers);
  // 프록시 특성상 원본 Host는 의미가 없고, 백엔드 서버의 Host로 교체되어야 하므로 제거
  headers.delete('host'); // ex: Host: localhost:3000: 지움
  if (opts?.dropCookies) headers.delete('cookie'); // api/public 프록시라면 쿠키 전달 X
  if (opts?.cookieHeader) headers.set('cookie', opts.cookieHeader);
  // Accept 헤더가 비어있다면 기본값을 application/json
  headers.set('accept', headers.get('accept') ?? 'application/json');
  return headers;
}

/** refresh 응답의 Set-Cookie 문자열에서 access/refresh 토큰만 추출 */
export function pickTokensFromSetCookie(setCookieHeader: string) {
  const map = new Map<string, string>();
  const parts = setCookieHeader.split(/,(?=[^;]+=)/);
  for (const p of parts) {
    const [kv] = p.trim().split(';');
    const eq = kv.indexOf('=');
    if (eq > 0) {
      const name = kv.slice(0, eq).trim();
      const value = kv.slice(eq + 1).trim();
      if (name === ACCESS_TOKEN_COOKIE || name === REFRESH_TOKEN_COOKIE) {
        map.set(name, value);
      }
    }
  }
  return map;
}
