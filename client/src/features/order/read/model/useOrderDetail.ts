'use client';

import { useQuery } from '@tanstack/react-query';

import type { Order } from '@/entities/order/model/types';
import { orderApi } from '@/entities/order/model/service';

export function useOrderDetail(orderId: string) {
  const query = useQuery<Order[], Error>({
    queryKey: ['orders', orderId],
    queryFn: () => orderApi.listByOrderId(orderId),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
    enabled: !!orderId,
  });

  return {
    orders: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  } as const;
}
