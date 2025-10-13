// src/apis/reviewApi.ts
import { fetcher } from '@/entities/http/fetcher';
import { publicFetcher } from '@/entities/http/publicFetcher';
import type { Review } from '@/entities/review/model/types';

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
