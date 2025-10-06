import { fetcher } from '@/utils/fetcher/fetcher';
import type { Category } from '@/interface/Category';

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
    fetcher<Category[]>(`/api/category/paths?id=${cno}`, {
      method: 'GET', ...(init ?? {})
    }),
};
