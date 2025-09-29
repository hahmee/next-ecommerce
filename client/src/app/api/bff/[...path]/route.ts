import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_BASE_URL = process.env.BACKEND_URL!;
const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

/** Set-Cookie 문자열에서 access/refresh 토큰만 뽑는다 */
function parseTokensFromSetCookie(setCookieHeader: string) {
  const map = new Map<string, string>();
  // 여러 Set-Cookie가 하나의 헤더로 합쳐질 수 있음
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

/** 현재 요청에서 인증 쿠키를 읽어 Cookie 헤더로 만든다 */
function getAuthCookiesHeader() {
  const cookieStore = cookies();
  const access = cookieStore.get(ACCESS_TOKEN_COOKIE)?.value;
  const refresh = cookieStore.get(REFRESH_TOKEN_COOKIE)?.value;
  return [
    access && `${ACCESS_TOKEN_COOKIE}=${access}`,
    refresh && `${REFRESH_TOKEN_COOKIE}=${refresh}`,
  ]
    .filter(Boolean)
    .join('; ');
}

/** 업스트림(백엔드)으로 원요청을 1회 전달 */
async function sendToBackend(
  path: string,
  req: Request,
  cookieHeader?: string,
  bodyBuf?: ArrayBuffer,
) {
  const url = new URL(req.url);
  const backendURL = `${API_BASE_URL}${url.pathname.replace(/^\/api\/bff/, '')}${url.search || ''}`;

  const headers = new Headers(req.headers);
  // 브라우저가 보낸 도메인 지움 (Host → BFF 주소이므로)
  headers.delete('host');
  headers.delete('cookie');
  // 필요한 헤더만 다시 세팅
  if (cookieHeader) headers.set('cookie', cookieHeader);
  headers.set('accept', headers.get('accept') ?? 'application/json');

  const body =
    req.method === 'GET' || req.method === 'HEAD'
      ? undefined
      : (bodyBuf ?? (await req.arrayBuffer()));

  return fetch(backendURL, { method: req.method, headers, body });
}

/** 1) 원요청 호출 → 2) 401이면 refresh → 3) 성공 시 재시도 */
async function handler(req: Request, path: string) {
  // 재시도를 위해 요청 바디를 한 번만 읽어 보관
  const bodyBuf =
    req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer(); // 요청 body 전체를 ArrayBuffer로 읽어옴

  // 1) 현재 쿠키로 원요청 호출
  const cookieHeader = getAuthCookiesHeader();
  const response = await sendToBackend(path, req, cookieHeader, bodyBuf);

  if (response.status !== 401) {
    const payload = await response.arrayBuffer(); // 원요청 응답의 body 전체를 ArrayBuffer로 읽음
    const bffRes = new NextResponse(payload, { status: response.status });

    const setCookie = response.headers.get('set-cookie');
    if (setCookie) bffRes.headers.append('set-cookie', setCookie);

    response.headers.forEach((v, k) => {
      if (k.toLowerCase() !== 'set-cookie') bffRes.headers.set(k, v);
    });
    return bffRes;
  }

  // 2) 401 → 토큰 리프레시 시도
  console.log('[BFF] 401 Unauthorized → refresh 시도');
  const refreshHeaders = new Headers();
  if (cookieHeader) refreshHeaders.set('cookie', cookieHeader);
  const refreshRes = await fetch(`${API_BASE_URL}/api/member/refresh`, {
    method: 'POST',
    headers: refreshHeaders,
  });
  console.log('[BFF] refresh 응답 상태:', refreshRes.status);

  if (!refreshRes.ok) {
    // 실패 → 세션 만료 처리
    const bffRes = NextResponse.json({ error: 'session_expired' }, { status: 401 });
    bffRes.cookies.set(ACCESS_TOKEN_COOKIE, '', { maxAge: 0, path: '/' });
    bffRes.cookies.set(REFRESH_TOKEN_COOKIE, '', { maxAge: 0, path: '/' });
    return bffRes;
  }

  // 3) 리프레시 성공 → 새 쿠키 패스스루 + 원요청 재시도
  const setCookie = refreshRes.headers.get('set-cookie');
  let retryCookieHeader = cookieHeader;

  if (setCookie) {
    // refresh 응답의 Set-Cookie 문자열에서 access/refresh 토큰만 뽑아냄
    const parsed = parseTokensFromSetCookie(setCookie);
    const access = parsed.get(ACCESS_TOKEN_COOKIE) ?? cookies().get(ACCESS_TOKEN_COOKIE)?.value;
    const refresh = parsed.get(REFRESH_TOKEN_COOKIE) ?? cookies().get(REFRESH_TOKEN_COOKIE)?.value;
    retryCookieHeader = [
      access && `${ACCESS_TOKEN_COOKIE}=${access}`,
      refresh && `${REFRESH_TOKEN_COOKIE}=${refresh}`,
    ]
      .filter(Boolean)
      .join('; ');
  }

  // 원래 요청을 새 토큰 쿠키로 다시 백엔드에 전달 (재시도)
  const retryRes = await sendToBackend(path, req, retryCookieHeader, bodyBuf);
  // 재시도 응답의 body 를 ArrayBuffer 로 읽음
  const retryPayload = await retryRes.arrayBuffer();
  // Next.js 응답 객체 생성해서 클라이언트로 돌려줄 준비
  const resp = new NextResponse(retryPayload, { status: retryRes.status });
  // refresh 응답에 Set-Cookie 가 있으면 그대로 브라우저로 전달해서 쿠키 갱신
  if (setCookie) resp.headers.append('set-cookie', setCookie);
  // 나머지 헤더들도 복사
  retryRes.headers.forEach((v, k) => {
    if (k.toLowerCase() !== 'set-cookie') resp.headers.set(k, v);
  });
  // 브라우저에 돌려줌
  return resp;
}

// 라우트 엔트리
export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  return handler(req, params.path.join('/'));
}
export async function POST(req: Request, { params }: { params: { path: string[] } }) {
  return handler(req, params.path.join('/'));
}
export async function PUT(req: Request, { params }: { params: { path: string[] } }) {
  return handler(req, params.path.join('/'));
}
export async function PATCH(req: Request, { params }: { params: { path: string[] } }) {
  return handler(req, params.path.join('/'));
}
export async function DELETE(req: Request, { params }: { params: { path: string[] } }) {
  return handler(req, params.path.join('/'));
}
