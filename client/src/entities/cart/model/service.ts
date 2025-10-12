import type { CartItemList } from '@/interface/CartItemList';
import { fetcher } from '@/utils/fetcher/fetcher';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const cartApi = {
  list: (init?: FetchOpts) =>
    fetcher<CartItemList[]>('/api/cart/items', {
      method: 'GET',
      ...(init ?? {}),
    }),
};
