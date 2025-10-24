'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { useSafeSearchParams } from '@/shared/lib/useSafeSearchParams';

export function useSearchBar() {
  const router = useRouter();
  const searchParams = useSafeSearchParams();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState('');

  // URL에서 query 값만 안전하게 추출 (표현식을 deps로 쓰지 않기)
  const urlQuery = useMemo(() => searchParams.get('query') || '', [searchParams]);

  // pathname / urlQuery 변할 때만 동기화
  useEffect(() => {
    setSearchQuery((prev) => (prev === urlQuery ? prev : urlQuery));
  }, [pathname, urlQuery]);

  //  submit은 useCallback으로 감싸고 실제로 쓰는 값만 deps
  const submit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const q = searchQuery.trim();

      // URLSearchParams는 매 호출마다 fresh하게 생성
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set('query', q);
      else params.delete('query');

      router.push(`/list?${params.toString()}`);
    },
    [router, searchQuery, searchParams],
  );

  return { searchQuery, setSearchQuery, submit } as const;
}
