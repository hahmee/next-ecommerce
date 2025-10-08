import { fetcher } from '@/utils/fetcher/fetcher';
import type { Product } from '@/interface/Product';
import type { PageResponse } from '@/interface/PageResponse';
import {DataResponse} from "@/interface/DataResponse";

type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
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

  // 재고(판매상태) 변경
  updateStock: (pno: number, salesStatus: string, init?: FetchOpts) =>
    fetcher<Product>(`/api/products/stock/${pno}`, {
      ...(init ?? {}),
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...(init?.headers || {}) },
      body: JSON.stringify({ salesStatus, pno }),
    }),

  // 공개 상세
  byIdPublic: (pno: string, init?: FetchOpts) =>
    fetcher<DataResponse<Product>>(`/api/public/products/${pno}`, {
      method: 'GET',
      ...(init ?? {}),
    }).then((r) => r.data),

  // 신상품/추천/전문가/전체 ID 등 (기존 시그니처 유지)
  newList: (init?: FetchOpts) =>
    fetcher<DataResponse<Product[]>>('/api/public/products/newProductList', {
      method: 'GET',
      ...(init ?? {}),
    }).then((r) => r.data),

  featuredList: (init?: FetchOpts) =>
    fetcher<DataResponse<Product[]>>('/api/public/products/featuredProductList', {
      method: 'GET',
      ...(init ?? {}),
    }).then((r) => r.data),

  expertList: (init?: FetchOpts) =>
    fetcher<DataResponse<Product[]>>('/api/public/products/expertProducts', {
      method: 'GET',
      ...(init ?? {}),
    }).then((r) => r.data),

  allIds: (init?: FetchOpts) =>
    fetcher<number[]>('/api/public/products/pnoList', {
      method: 'GET',
      ...(init ?? {}),
    }),
};
