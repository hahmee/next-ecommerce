// src/widgets/layout/model/useSearchBar.ts

// src/widgets/layout/model/useSearchBar.ts

'use client';

import { usePathname, useRouter } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';

import { useSafeSearchParams } from '@/shared/lib/useSafeSearchParams';

export function useSearchBar() {
  const router = useRouter();
  const searchParams = useSafeSearchParams();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const urlQ = searchParams.get('query') || '';
    // 값이 실제로 달라졌을 때만 반영
    setSearchQuery((prev) => (prev === urlQ ? prev : urlQ));
  }, [pathname, searchParams.toString()]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    const params = new URLSearchParams(searchParams.toString());
    if (q) params.set('query', q);
    else params.delete('query');
    router.push(`/list?${params.toString()}`);
  };

  return {
    searchQuery,
    setSearchQuery,
    submit,
  } as const;
}
