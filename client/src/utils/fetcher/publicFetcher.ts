const isServer = typeof window === 'undefined';
const BASE = process.env.BACKEND_URL!; // 서버에서만 사용

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export async function publicFetcher<T>(path: string, init?: FetchOpts): Promise<T> {
  // 서버: 내부 백엔드 주소 직통
  // 클라이언트: BFF의 공개 프록시(/api/public/*) 경유
  const url = isServer
    ? `${BASE}${path}` // e.g. http://back:8080/api/public/...
    : path.startsWith('/api/public')
      ? path
      : `/api/public${path}`; // 브라우저는 항상 BFF 경유

  const res = await fetch(url, {
    credentials: 'omit', // 공개 API는 쿠키/세션 금지
    method: init?.method ?? 'GET',
    ...init,
  });

  const text = await res.text();
  const json = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = (json && (json.message || json.error)) || 'Public API 요청 실패';
    throw new Error(msg);
  }

  // { data: ... } 형태면 언랩, 아니면 그대로
  if (json && typeof json === 'object' && 'data' in json) {
    return (json.data ?? null) as T;
  }
  return json as T;
}
