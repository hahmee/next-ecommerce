import {Member} from "@/interface/Member";
import {fetcher} from "@/utils/fetcher/fetcher";


type FetchOpts = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export const authApi = {
  me: (init?: FetchOpts) => fetcher<Member>('/api/me', {
      method: 'GET',
      ...(init ?? {}),
    }),

  logout: (init?: FetchOpts) =>
    fetcher<void>('/api/member/logout', {
      method: 'POST',
      ...(init ?? {}),
    }),
};
