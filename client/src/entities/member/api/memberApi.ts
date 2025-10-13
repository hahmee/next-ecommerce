// src/libs/services/memberApi.ts
import type { Member } from '@/entities/member/model/Member';
import type { PageResponse } from '@/entities/order/model/PageResponse';
import { fetcher } from '@/shared/http/fetcher';

export type ListArgs = { page: number; size: number; search: string };

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const memberApi = {
  listAdmin: ({ page, size, search }: ListArgs, init?: FetchOpts) =>
    fetcher<PageResponse<Member>>(
      `/api/members?page=${page}&size=${size}&search=${encodeURIComponent(search)}`,
      {
        ...(init ?? {}),
        method: 'GET',
      },
    ),
};
