// hooks/useCreateOrderMutation.ts

import { useMutation } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetcher/fetcher';
import { OrderRequest } from '@/interface/Order';
import { toast } from 'react-hot-toast';
import { SessionExpiredError } from '@/libs/error/errors';

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: (order: OrderRequest) =>
      fetcher(`/api/orders/`, {
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

    onError: (error: any) => {
      if (!(error instanceof SessionExpiredError)) {
        toast.error(error.message || '주문 저장 중 문제가 발생했습니다.');
      }
    },
  });
};
