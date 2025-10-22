// src/features/order/read/model/useUserOrders.ts



'use client';

import { useQuery } from '@tanstack/react-query';

import { paymentApi } from '@/entities/payment/api/paymentApi';
import type { Payment } from '@/entities/payment/model/types';

export function useUserOrders() {
  const query = useQuery<Payment[], Error>({
    queryKey: ['payments'],
    queryFn: () => paymentApi.list(),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  return {
    payments: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  } as const;
}
