'use client';

import { useQuery } from '@tanstack/react-query';

import type { Payment } from '@/entities/payment';
import { paymentApi } from '@/entities/payment';

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
