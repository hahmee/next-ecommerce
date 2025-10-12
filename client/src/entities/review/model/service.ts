// src/apis/reviewApi.ts
import type { Review } from '@/interface/Review';
import { fetcher } from '@/utils/fetcher/fetcher';
import { publicFetcher } from '@/utils/fetcher/publicFetcher';

type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export const reviewApi = {
  listByProduct: (pno: string, init?: FetchOpts) =>
    publicFetcher<Review[]>(`/api/public/reviews/list/${pno}`, {
      method: 'GET',
      ...(init ?? {}),
    }),

  // 인증: 내 리뷰 목록
  myReviews: (init?: FetchOpts) =>
    fetcher<Review[]>(`/api/reviews/myReviews`, {
      method: 'GET',
      ...(init ?? {}),
    }),
};
