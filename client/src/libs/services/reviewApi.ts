// src/apis/reviewApi.ts
import type {Review} from '@/interface/Review';
import {publicFetcher} from "@/utils/fetcher/publicFetcher";

type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export const reviewApi = {
  listByProduct: (pno: string, init?: FetchOpts) =>
    publicFetcher<Review[]>(`/api/public/reviews/list/${pno}`, {
      method: 'GET',
      ...(init ?? {}),
    }),
};
