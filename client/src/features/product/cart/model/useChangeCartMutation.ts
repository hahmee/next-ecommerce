// src/features/product/cart/model/useChangeCartMutation.ts

﻿// src/features/product/cart/model/useChangeCartMutation.ts



import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { CartItem } from '@/entities/cart/model/CartItem';
import { CartItemList } from '@/entities/cart/model/CartItemList';
import { fetcher } from '@/shared/http/fetcher';
import { useCartStore } from '@/shared/store/cartStore';

export const useChangeCartMutation = () => {
  const setCarts = useCartStore((s) => s.setCarts);

  return useMutation({
    mutationFn: (cartItem: CartItem) =>
      fetcher<CartItemList[]>('/api/cart/change', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cartItem),
      }),
    onSuccess: (data) => {
      setCarts(data);
      toast.success('장바구니에 담겼습니다.');
    },
    // onError 없음 → 전역에서 처리
  });
};
