'use client';

import { useQuery } from '@tanstack/react-query';

import type { Product } from '@/interface/Product';
import { productApi } from '@/entities/product/api/productApi';

export function useExpertProducts() {
  return useQuery<Product[]>({
    queryKey: ['expert-products'],
    queryFn: () => productApi.expertList(),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
  });
}
