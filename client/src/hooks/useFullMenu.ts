'use client';

import { useQuery } from '@tanstack/react-query';
import type { Category } from '@/interface/Category';
import {categoryApi} from "@/libs/services/categoryApi";

export function useFullMenu() {
  const { data, isLoading, error } = useQuery<Category[], Error>({
    queryKey: ['categories'],
    queryFn: () => categoryApi.listPublic({ next: { revalidate: 60, tags: ['categories'] } }),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
  });

  return {
    categories: data ?? [],
    isLoading,
    error,
  } as const;
}
