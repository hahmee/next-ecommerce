import { NextResponse } from 'next/server';

import { readBodyBuffer } from '@/entities/proxy/body';
import { buildProxyHeaders } from '@/entities/proxy/headers';
import { guardHttpMethod } from '@/entities/proxy/methodGuard';
import { buildBackendUrlForPublic } from '@/entities/proxy/url';

async function handler(req: Request, path: string[]) {
  console.log('public...');
  // HTTP 메서드가 허용된 집합에 포함되어 있는지 검사
  const methodError = guardHttpMethod(req);
  if (methodError) return methodError;

  const backendURL = buildBackendUrlForPublic(req, path);
  const headers = buildProxyHeaders(req, { dropCookies: true });
  const body = await readBodyBuffer(req);

  const res = await fetch(backendURL, {
    method: req.method,
    headers,
    body,
    credentials: 'omit', // 공개 라인: 쿠키/인증 금지
  });

  const payload = await res.arrayBuffer();
  const out = new NextResponse(payload, { status: res.status });

  // 공개 라인은 Set-Cookie 전달 불가/불필요
  res.headers.forEach((v, k) => {
    if (k.toLowerCase() !== 'set-cookie') out.headers.set(k, v);
  });

  return out;
}

export const GET = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path);
export const POST = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path);
export const PUT = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path);
export const PATCH = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path);
export const DELETE = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path);
export const HEAD = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path);
export const OPTIONS = (req: Request, { params }: { params: { path: string[] } }) =>
  handler(req, params.path);
