import { Member } from '@/interface/Member';
import { fetcher } from '@/utils/fetcher/fetcher';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const profileApi = {
  get: (init?: FetchOpts) =>
    fetcher<Member>('/api/profile', {
      method: 'GET',
      ...(init ?? {}),
    }),
};
