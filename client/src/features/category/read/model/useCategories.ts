'use client';

import { useQuery } from '@tanstack/react-query';

import type { Category } from '@/entities/category/model/types';
import { categoryApi } from '@/entities/category/model/service';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
  });
}
