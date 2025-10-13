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
    setSearchQuery(searchParams.get('query') || '');
  }, [searchParams, pathname]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    const params = new URLSearchParams(searchParams.toString());
    params.delete('query');
    if (q) params.append('query', q);
    router.push(`/list?${params.toString()}`);
  };

  return {
    searchQuery,
    setSearchQuery,
    submit,
  } as const;
}
