import type { CartItemList } from '@/entities/cart';
import { fetcher } from '@/shared/http/fetcher';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const cartApi = {
  list: (init?: FetchOpts) =>
    fetcher<CartItemList[]>('/api/cart/items', {
      method: 'GET',
      ...(init ?? {}),
    }),
};
