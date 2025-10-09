import {fetcher} from '@/utils/fetcher/fetcher';
import type {Product} from '@/interface/Product';
import type {PageResponse} from '@/interface/PageResponse';
import {publicFetcher} from "@/utils/fetcher/publicFetcher";

type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

type ListPublicArgs = {
  page: number;
  row: number;                 // ← API 쿼리에서는 size로 변환
  categoryId: string;
  colors?: string | string[];  // ← 쿼리 키: color
  productSizes?: string | string[]; // ← 쿼리 키: productSize
  minPrice: string;
  maxPrice: string;
  order: string;
  query: string;
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
    publicFetcher<Product>(`/api/public/products/${pno}`, {
      method: 'GET',
      ...(init ?? {}),
    }),

  // 신상품/추천/전문가/전체 ID 등 (기존 시그니처 유지)
  newList: (init?: FetchOpts) =>
    publicFetcher<Product[]>('/api/public/products/newProductList', {
      method: 'GET',
      ...(init ?? {}),
    }) ,

  featuredList: (init?: FetchOpts) =>
    publicFetcher<Product[]>('/api/public/products/featuredProductList', {
      method: 'GET',
      ...(init ?? {}),
    }) ,

  expertList: (init?: FetchOpts) =>
    publicFetcher<Product[]>('/api/public/products/expertProducts', {
      method: 'GET',
      ...(init ?? {}),
    }),

  allIds: (init?: FetchOpts) =>
    publicFetcher<number[]>('/api/public/products/pnoList', {
      method: 'GET',
      ...(init ?? {}),
    }),

  listPublic: (args: ListPublicArgs, init?: FetchOpts) => {
    const {
      page, row, categoryId,
      colors, productSizes,
      minPrice, maxPrice, order, query,
    } = args;

    const qs = new URLSearchParams();
    qs.set('page', String(page));
    qs.set('size', String(row));              // ← row를 size로
    qs.set('categoryId', categoryId ?? '');
    qs.set('minPrice', minPrice ?? '');
    qs.set('maxPrice', maxPrice ?? '');
    qs.set('order', order ?? '');
    qs.set('query', query ?? '');

    const colorArr = Array.isArray(colors) ? colors : colors ? [colors] : [];
    colorArr.forEach((c) => qs.append('color', c)); // ← 키: color

    const sizeArr = Array.isArray(productSizes) ? productSizes : productSizes ? [productSizes] : [];
    sizeArr.forEach((s) => qs.append('productSize', s)); // ← 키: productSize

    return publicFetcher<PageResponse<Product>>(
      `/api/public/products/list?${qs.toString()}`,
      {
          method: 'GET',
          ...(init ?? {})
      },
    );
  },

};
