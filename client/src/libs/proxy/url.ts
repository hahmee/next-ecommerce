import { API_BASE_URL } from './constants';

/** /api/bff/* → 백엔드의 동일 경로로 변환 */
export function buildBackendUrlForBff(req: Request) {
  const url = new URL(req.url);
  // 정규식으로 "/api/bff" 문자열을 지움
  return `${API_BASE_URL}${url.pathname.replace(/^\/api\/bff/, '')}${url.search || ''}`;
}

/** /api/public/* → 백엔드 /api/public/* 로 변환 */
export function buildBackendUrlForPublic(req: Request, path: string[]) {
  const url = new URL(req.url);
  console.log('url',url)
  const qs = url.search || '';
  return `${API_BASE_URL}/api/public/${path.join('/')}${qs}`;
}
