import { fetcher } from '@/utils/fetcher/fetcher';
import type { PageResponse } from '@/interface/PageResponse';
import type { Payment } from '@/interface/Payment';
import type {Order} from "@/interface/Order";

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const orderApi = {
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
    return fetcher<PageResponse<Payment>>(
      `/api/payments/searchAdminOrders?${qs.toString()}`,
      { ...(init ?? {}), method: 'GET' },
    );
  },
};
