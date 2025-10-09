// src/hooks/useUserOrders.ts
'use client';

import { useQuery } from '@tanstack/react-query';
import type { Payment } from '@/interface/Payment';
import { paymentApi } from '@/libs/services/paymentApi';

export function useUserOrders() {
  const query = useQuery<Payment[], Error>({
    queryKey: ['payments'],
    queryFn: () => paymentApi.list(),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
  });

  return {
    payments: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
  } as const;
}
