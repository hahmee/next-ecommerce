// src/features/category/read/model/useCategories.ts

// src/features/category/read/model/useCategories.ts

'use client';

import { useQuery } from '@tanstack/react-query';

import { categoryApi } from '@/entities/category';
import type { Category } from '@/entities/category';

export function useCategories() {
  return useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
  });
}
