// hooks/useDeleteCartMutation.ts

import { useMutation } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetcher/fetcher';
import { toast } from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { SessionExpiredError } from '@/libs/error/errors';
import { CartItemList } from '@/interface/CartItemList';

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
    onError: (error: any) => {
      if (!(error instanceof SessionExpiredError)) {
        toast.error(error.message || '장바구니 삭제 실패');
      }
    },
  });
};
