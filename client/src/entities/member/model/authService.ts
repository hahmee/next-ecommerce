import { fetcher } from '@/shared/http/fetcher';
import { Member } from '@/entities/member/model/Member';

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
