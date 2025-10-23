// src/entities/member/api/profileApi.ts

// src/entities/member/api/profileApi.ts

import { Member } from '@/entities/member/model/Member';
import { fetcher } from '@/shared/http/fetcher';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const profileApi = {
  get: (init?: FetchOpts) =>
    fetcher<Member>('/api/profile', {
      method: 'GET',
      ...(init ?? {}),
    }),
};
