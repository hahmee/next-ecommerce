'use client';

import { useQuery } from '@tanstack/react-query';
import { categoryApi } from '@/libs/services/categoryApi';
import type { Category } from '@/interface/Category';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
  });
}
