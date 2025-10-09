import { fetcher } from '@/utils/fetcher/fetcher';
import {Member} from "@/interface/Member";

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const profileApi = {
  get: (init?: FetchOpts) =>
    fetcher<Member>('/api/profile', {
      method: 'GET',
      ...(init ?? {}),
    }),
};
