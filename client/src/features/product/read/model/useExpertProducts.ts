'use client';

import { useQuery } from '@tanstack/react-query';

import { productApi } from '@/entities/product/model/service';
import type { Product } from '@/entities/product/model/types';

export function useExpertProducts() {
  return useQuery<Product[]>({
    queryKey: ['expert-products'],
    queryFn: () => productApi.expertList(),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
  });
}
