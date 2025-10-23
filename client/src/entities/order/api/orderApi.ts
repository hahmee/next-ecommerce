// src/entities/order/api/orderApi.ts

// src/entities/order/api/orderApi.ts

import type { PageResponse } from '@/entities/order/model/PageResponse';
import type { Order } from '@/entities/order/model/types';
import type { Payment } from '@/entities/payment/model/types';
import { fetcher } from '@/shared/http/fetcher';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const orderApi = {
  // 주문 항목 단건 (리뷰 작성용)
  byId: (id: string, init?: FetchOpts) =>
    fetcher<Order>(`/api/orders/${id}`, {
      method: 'GET',
      credentials: 'include', // 인증 필요
      cache: 'no-store', // 개인 데이터: 캐시 금지
      ...(init ?? {}),
    }),

  listByOrderId: (orderId: string, init?: FetchOpts) =>
    fetcher<Order[]>(`/api/orders/list/${orderId}`, {
      method: 'GET',
      ...(init ?? {}),
    }),

  // 어드민 주문 목록 검색
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
    return fetcher<PageResponse<Payment>>(`/api/payments/searchAdminOrders?${qs.toString()}`, {
      ...(init ?? {}),
      method: 'GET',
    });
  },
};
