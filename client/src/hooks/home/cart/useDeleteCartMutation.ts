// hooks/useDeleteCartMutation.ts

import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { CartItemList } from '@/interface/CartItemList';
import { useCartStore } from '@/store/cartStore';
import { fetcher } from '@/utils/fetcher/fetcher';

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
