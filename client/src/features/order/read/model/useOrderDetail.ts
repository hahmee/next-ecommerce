// src/features/order/read/model/useOrderDetail.ts

﻿// src/features/order/read/model/useOrderDetail.ts



'use client';

import { useQuery } from '@tanstack/react-query';

import { orderApi } from '@/entities/order/api/orderApi';
import type { Order } from '@/entities/order/model/types';

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
