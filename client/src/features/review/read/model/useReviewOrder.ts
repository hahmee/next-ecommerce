// src/features/review/read/model/useReviewOrder.ts

﻿// src/features/review/read/model/useReviewOrder.ts



'use client';

import { useQuery } from '@tanstack/react-query';

import { orderApi } from '@/entities/order/api/orderApi';
import type { Order } from '@/entities/order/model/types';

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
