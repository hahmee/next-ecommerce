import { fetcher } from '@/utils/fetcher/fetcher';
import type { CartItemList } from '@/interface/CartItemList';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const cartApi = {
  list: (init?: FetchOpts) =>
    fetcher<CartItemList[]>('/api/cart/items', {
      method: 'GET',
      ...(init ?? {}),
    }),
};
