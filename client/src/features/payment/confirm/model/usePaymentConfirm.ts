'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { paymentApi } from '@/entities/payment';
import { PaymentConfirmVM } from '@/features/payment/confirm';

export function usePaymentConfirm(paymentKey: string) {
  const qc = useQueryClient();

  const query = useQuery<PaymentConfirmVM>({
    queryKey: ['payment-confirm', paymentKey],
    enabled: !!paymentKey,
    retry: false,
    staleTime: 60_000,
    gcTime: 300_000,
    queryFn: async () => {
      const p = await paymentApi.byKey(paymentKey); // 실패 시 throw → 전역 onError + isError
      return {
        orderId: p.orderId,
        orderName: (p as any).orderName ?? (p as any).name ?? '주문',
        totalAmount: p.totalAmount ?? (p as any).amount ?? 0,
        raw: p,
      };
    },
  });

  useEffect(() => {
    if (query.isSuccess) {
      qc.invalidateQueries({ queryKey: ['carts'] }).catch(() => {});
    }
  }, [query.isSuccess, qc]);

  return query;
}
