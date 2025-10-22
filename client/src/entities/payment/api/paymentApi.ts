// src/entities/payment/api/paymentApi.ts

﻿// src/entities/payment/api/paymentApi.ts

import type { PageResponse } from '@/entities/order/model/PageResponse';
import type { PaymentSummaryDTO } from '@/entities/payment/model/PaymentSummaryDTO';
import type { Payment } from '@/entities/payment/model/types';
import { fetcher } from '@/shared/http/fetcher';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const paymentApi = {
  byKey: (paymentKey: string) =>
    fetcher<Payment>(`/api/payments/${encodeURIComponent(paymentKey)}`, {
      method: 'GET',
    }),

  list: (init?: FetchOpts) =>
    fetcher<Payment[]>('/api/payments/list', {
      method: 'GET',
      ...(init ?? {}),
    }),

  overview: (startDate = '', endDate = '', init?: FetchOpts) =>
    fetcher<PaymentSummaryDTO>(
      `/api/payments/paymentsOverview?startDate=${encodeURIComponent(startDate)}&endDate=${encodeURIComponent(endDate)}`,
      {
        ...(init ?? {}),
        method: 'GET',
      },
    ),

  searchAdmin: (
    page: number,
    size: number,
    search = '',
    startDate = '',
    endDate = '',
    init?: FetchOpts,
  ) => {
    const qs = new URLSearchParams({
      page: String(page),
      size: String(size),
      search,
      startDate,
      endDate,
    });
    return fetcher<PageResponse<Payment>>(`/api/payments/searchAdminPaymentList?${qs.toString()}`, {
      ...(init ?? {}),
      method: 'GET',
    });
  },
};
