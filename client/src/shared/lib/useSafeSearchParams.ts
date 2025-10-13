'use client';

import { useSearchParams } from 'next/navigation';

/**
 * useSafeSearchParams
 * 항상 URLSearchParams를 반환하므로 null 안전
 */
export function useSafeSearchParams(): URLSearchParams {
  const sp = useSearchParams();
  return new URLSearchParams(sp?.toString());
}
