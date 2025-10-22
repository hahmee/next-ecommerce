// src/entities/cart/api/cartApi.ts

﻿// src/entities/cart/api/cartApi.ts

import type { CartItemList } from '@/entities/cart/model/CartItemList';
import { fetcher } from '@/shared/http/fetcher';

type FetchOpts = RequestInit & { next?: { revalidate?: number; tags?: string[] } };

export const cartApi = {
  list: (init?: FetchOpts) =>
    fetcher<CartItemList[]>('/api/cart/items', {
      method: 'GET',
      ...(init ?? {}),
    }),
};
