// src/features/payment/confirm/model/usePaymentConfirm.ts

﻿// src/features/payment/confirm/model/usePaymentConfirm.ts

'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { paymentApi } from '@/entities/payment/api/paymentApi';
import type { Payment } from '@/entities/payment/model/types';

export type PaymentConfirmVM = {
  orderId: string;
  orderName: string;
  totalAmount: number;
  raw: Payment;
};

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
