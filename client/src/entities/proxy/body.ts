/**
 * 요청 바디를 한 번만 읽어 재사용하기 위해 ArrayBuffer로 획득
 * POST/PUT/PATCH 요청일 때만 실제 ArrayBuffer 반환
 *
 * 용도
 * 처음 시도할때 body 스트림이 한 번 소모됨
 * 원요청 재시도 할 때 req.body가 다시 필요함
 *
 * */
export async function readBodyBuffer(req: Request) {
  return req.method === 'GET' || req.method === 'HEAD' ? undefined : await req.arrayBuffer();
}
