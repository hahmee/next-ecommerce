// src/features/product/cart/model/useDeleteCartMutation.ts

﻿// src/features/product/cart/model/useDeleteCartMutation.ts

import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { CartItemList } from '@/entities/cart/model/CartItemList';
import { fetcher } from '@/shared/http/fetcher';
import { useCartStore } from '@/shared/store/cartStore';

export const useDeleteCartMutation = () => {
  const setCarts = useCartStore((s) => s.setCarts);

  return useMutation({
    // cino (cart item number) 하나만 받음
    mutationFn: async (cino: number) => {
      return fetcher<CartItemList[]>(`/api/cart/${cino}`, {
        method: 'DELETE',
      });
    },
    onSuccess: (data) => {
      setCarts(data);
      toast.success('장바구니에서 삭제되었습니다.');
    },
  });
};
