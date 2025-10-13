import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

import { fetcher } from '@/entities/http/fetcher';
import { OrderRequest } from '@/entities/order/model/types';

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: (order: OrderRequest) =>
      fetcher(`/api/orders`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      }),
    onSuccess: () => {
      toast.success('주문이 저장되었습니다.');
    },
  });
};
