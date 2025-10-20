// src/widgets/layout/model/useFullMenu.ts

'use client';

import { useQuery } from '@tanstack/react-query';

import { categoryApi } from '@/entities/category/api/categoryApi';
import type { Category } from '@/entities/category/model/types';

export function useFullMenu() {
  const { data, isLoading, error } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => categoryApi.listPublic({ next: { revalidate: 60, tags: ['categories'] } }),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  return {
    categories: data ?? [],
    isLoading,
    error,
  } as const;
}
