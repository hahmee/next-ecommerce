'use client';

import { useQuery } from '@tanstack/react-query';

import type { Product } from '@/interface/Product';
import { productApi } from '@/libs/services/productApi';

export function useExpertProducts() {
  return useQuery<Product[]>({
    queryKey: ['expert-products'],
    queryFn: () => productApi.expertList(),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
  });
}
