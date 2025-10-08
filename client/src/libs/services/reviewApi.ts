// src/apis/reviewApi.ts
import { fetcher } from '@/utils/fetcher/fetcher';
import type { DataResponse } from '@/interface/DataResponse';
import type { Review } from '@/interface/Review';

type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export const reviewApi = {
  listByProduct: (pno: string, init?: FetchOpts) =>
    fetcher<DataResponse<Review[]>>(`/api/public/reviews/list/${pno}`, {
      method: 'GET',
      ...(init ?? {}),
    }),
};
