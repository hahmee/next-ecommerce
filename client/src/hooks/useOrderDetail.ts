'use client';

import {useQuery} from '@tanstack/react-query';
import type {Order} from '@/interface/Order';
import {orderApi} from "@/libs/services/orderApi";

export function useOrderDetail(orderId: string) {
  const query = useQuery<Order[], Error>({
    queryKey: ['orders', orderId],
    queryFn: () => orderApi.listByOrderId(orderId),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
    enabled: !!orderId,
  });

  return {
    orders: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  } as const;
}
