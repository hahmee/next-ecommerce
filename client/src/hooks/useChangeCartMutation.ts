import { useMutation } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetcher/fetcher';
import { CartItem } from '@/interface/CartItem';
import { CartItemList } from '@/interface/CartItemList';
import { toast } from 'react-hot-toast';
import { useCartStore } from '@/store/cartStore';
import { SessionExpiredError } from '@/libs/error/errors';

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
    onError: (error: any) => {
      // SessionExpiredError는 전역에서 처리하므로 여기선 무시
      if (!(error instanceof SessionExpiredError)) {
        toast.error(error.message || '장바구니 처리 실패');
      }
    },
  });
};
