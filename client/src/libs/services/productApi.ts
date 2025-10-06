import { fetcher } from '@/utils/fetcher/fetcher';
import type { Product } from '@/interface/Product';
import type { PageResponse } from '@/interface/PageResponse';

type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] }; // 서버에서만 의미 있음
};

export const productApi = {
  // 단건 조회
  byId: (id: string, init?: FetchOpts) =>
    fetcher<Product>(`/api/products/${id}`, {
      ...(init ?? {}),
      method: 'GET',
    }),

  // 생성 (FormData 그대로 전달)
  create: (form: FormData, init?: FetchOpts) =>
    fetcher<Product>(`/api/products`, {
      ...(init ?? {}),
      method: 'POST',
      body: form,
    }),

  // 수정
  update: (id: string, form: FormData, init?: FetchOpts) =>
    fetcher<Product>(`/api/products/${id}`, {
      ...(init ?? {}),
      method: 'PUT',
      body: form,
    }),

  // 어드민 검색 목록
  searchAdmin: (page: number, size: number, search = '', init?: FetchOpts) => {
    const qs = new URLSearchParams({ page: String(page), size: String(size), search });
    return fetcher<PageResponse<Product>>(
      `/api/products/searchAdminList?${qs.toString()}`,
      {
        ...(init ?? {}),
        method: 'GET',
      },
    );
  },

  // 삭제
  remove: (pno: number, init?: FetchOpts) =>
    fetcher<void>(`/api/products/${pno}`, {
      ...(init ?? {}),
      method: 'DELETE',
    }),
};
