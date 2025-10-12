'use client';

import { useQuery } from '@tanstack/react-query';

import type { Order } from '@/entities/order/model/types';
import { orderApi } from '@/entities/order/model/service';

export function useReviewOrder(id: string) {
  const query = useQuery<Order, Error>({
    queryKey: ['order', id],
    queryFn: () => orderApi.byId(id),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
    enabled: !!id,
  });

  return {
    order: query.data ?? null,
    isLoading: query.isLoading,
    error: query.error,
  } as const;
}
