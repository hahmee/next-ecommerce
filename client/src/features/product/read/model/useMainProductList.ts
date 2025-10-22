// src/features/product/read/model/useMainProductList.ts

﻿// src/features/product/read/model/useMainProductList.ts

'use client';

import { useQuery } from '@tanstack/react-query';
import { useCallback } from 'react';

import type { CartItem } from '@/entities/cart/model/CartItem';
import { productApi } from '@/entities/product/api/productApi';
import { SalesStatus } from '@/entities/product/consts/SalesStatus';
import type { Product } from '@/entities/product/model/types';
import { useChangeCartMutation } from '@/features/product/cart/model/useChangeCartMutation';
import type { ColorTag } from '@/shared/model/ColorTag';
import { useCartStore } from '@/shared/store/cartStore';
import { useUserStore } from '@/shared/store/userStore';

type MainListType = 'new' | 'featured';

export function useMainProductList(type: MainListType) {
  const { carts, changeOpen, isLoading: cartLoading } = useCartStore();
  const { user } = useUserStore();
  const { mutate: changeCart } = useChangeCartMutation();

  const query = useQuery<Product[]>({
    queryKey: [type === 'new' ? 'new-products' : 'featured-products'],
    queryFn: () => (type === 'new' ? productApi.newList() : productApi.featuredList()),
    staleTime: 60_000,
    gcTime: 300_000,
    retry: false,
  });

  const isAddDisabled = useCallback(
    (p: Product) => !user || p.salesStatus !== SalesStatus.ONSALE || cartLoading,
    [user, cartLoading],
  );

  const addToCart = useCallback(
    (p: Product, opts?: { color?: ColorTag; size?: string }) => {
      changeOpen(true);

      const color = opts?.color ?? p.colorList?.[0];
      const size = opts?.size ?? p.sizeList?.[0];

      if (!color || !size) return; // 옵션이 없으면 안전탈출

      const existing = carts.find((i) => i.size === size && i.color.id === color.id);

      const item: CartItem = {
        email: user?.email || '',
        pno: p.pno,
        qty: existing ? existing.qty + 1 : 1,
        color,
        size,
        sellerEmail: p.owner.email,
      };

      changeCart(item);
    },
    [carts, changeOpen, changeCart, user?.email],
  );

  return {
    products: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    addToCart,
    isAddDisabled,
  } as const;
}
