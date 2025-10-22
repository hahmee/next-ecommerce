// src/entities/category/api/categoryApi.ts



import { CategoryTree } from '@/entities/category/model/categoryTree';
import type { Category } from '@/entities/category/model/types';
import type { PageResponse } from '@/entities/order/model/PageResponse';
import { fetcher } from '@/shared/http/fetcher';
import { publicFetcher } from '@/shared/http/publicFetcher';

type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export const categoryApi = {
  byId: (cno: string, init?: FetchOpts) =>
    fetcher<Category>(`/api/category/${cno}`, { ...(init ?? {}), method: 'GET' }),

  list: (init?: FetchOpts) =>
    fetcher<Category[]>('/api/category/list', {
      method: 'GET',
      ...(init ?? {}),
    }),

  paths: (cno: string, init?: FetchOpts) =>
    fetcher<Category[]>(`/api/category/paths/${cno}`, {
      method: 'GET',
      ...(init ?? {}),
    }),

  create: (form: FormData, init?: FetchOpts) =>
    fetcher<Category>(`/api/category`, { ...(init ?? {}), method: 'POST', body: form }),

  update: (cno: string, form: FormData, init?: FetchOpts) =>
    fetcher<Category>(`/api/category/${cno}`, { ...(init ?? {}), method: 'PUT', body: form }),

  // 어드민 검색 목록
  searchAdmin: (page: number, size: number, search = '', init?: FetchOpts) => {
    const qs = new URLSearchParams({ page: String(page), size: String(size), search });
    return fetcher<PageResponse<CategoryTree>>(`/api/category/searchAdminList?${qs.toString()}`, {
      ...(init ?? {}),
      method: 'GET',
    });
  },
  remove: (cno: number, init?: FetchOpts) =>
    fetcher<number[] | void>(`/api/category/${cno}`, { ...(init ?? {}), method: 'DELETE' }),

  // 공개 카테고리 목록
  listPublic: (init?: FetchOpts) =>
    publicFetcher<Category[]>('/api/public/category/list', {
      method: 'GET',
      ...(init ?? {}),
    }),

  // 공개 카테고리 단건
  byIdPublic: (id: string, init?: FetchOpts) =>
    publicFetcher<Category>(`/api/public/category/${id}`, {
      method: 'GET',
      ...(init ?? {}),
    }),
};
