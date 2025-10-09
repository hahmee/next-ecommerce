'use client';

import { useEffect, useState, FormEvent } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
