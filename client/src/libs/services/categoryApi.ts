import {fetcher} from '@/utils/fetcher/fetcher';
import type {Category} from '@/interface/Category';
import type {PageResponse} from "@/interface/PageResponse";
import {CategoryTree} from "@/interface/CategoryTree";

type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export const categoryApi = {
  list: (init?: FetchOpts) =>
    fetcher<Category[]>('/api/category/list', {
      method: 'GET',
      ...(init ?? {}),
    }),

  paths: (cno: string, init?: FetchOpts) =>
    fetcher<Category[]>(`/api/category/paths/${cno}`, {
      method: 'GET',
      ...(init ?? {})
    }),

  // 어드민 검색 목록
  searchAdmin: (page: number, size: number, search = '', init?: FetchOpts) => {
    const qs = new URLSearchParams({ page: String(page), size: String(size), search });
    return fetcher<PageResponse<CategoryTree>>(
      `/api/category/searchAdminList?${qs.toString()}`,
      {
        ...(init ?? {}),
        method: 'GET',
      },
    );
  },
  remove: (cno: number, init?: FetchOpts) =>
    fetcher<number[] | void>(`/api/category/${cno}`, { ...(init ?? {}), method: 'DELETE' }),

};
