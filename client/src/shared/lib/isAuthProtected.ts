// src/shared/lib/isAuthProtected.ts

/** 인증이 필요한 API 경로인지 여부 판단 */
export function isAuthProtected(path: string): boolean {
  const protectedPaths = [
    '/api/me',
    '/api/member/me',
    '/api/member/update',
    '/api/order',
    '/api/cart',
    '/api/wishlist',
    '/api/secure/', // startsWith 대응용
  ];

  // 정확히 일치하거나, startsWith 경로도 포함
  return protectedPaths.some((protectedPath) => {
    return path === protectedPath || path.startsWith(protectedPath);
  });
}
