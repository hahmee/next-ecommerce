// src/libs/services/memberApi.ts
import type { Member } from '@/interface/Member';
import type { PageResponse } from '@/interface/PageResponse';
import { fetcher } from '@/utils/fetcher/fetcher';

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
