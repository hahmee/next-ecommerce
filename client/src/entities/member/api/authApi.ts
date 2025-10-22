// src/entities/member/api/authApi.ts

﻿// src/entities/member/api/authApi.ts

import { Member } from '@/entities/member/model/Member';
import { fetcher } from '@/shared/http/fetcher';

type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export const authApi = {
  me: (init?: FetchOpts) =>
    fetcher<Member>('/api/me', {
      method: 'GET',
      ...(init ?? {}),
    }),

  logout: (init?: FetchOpts) =>
    fetcher<void>('/api/member/logout', {
      method: 'POST',
      ...(init ?? {}),
    }),
};
