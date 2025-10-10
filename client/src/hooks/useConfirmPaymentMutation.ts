import { useMutation } from '@tanstack/react-query';
import { fetcher } from '@/utils/fetcher/fetcher';
import { toast } from 'react-hot-toast';

interface ConfirmPaymentParams {
  paymentKey: string;
  orderId: string;
  amount: string;
}

export const useConfirmPaymentMutation = () => {
  return useMutation({
    mutationFn: async ({ paymentKey, orderId, amount }: ConfirmPaymentParams) =>
      fetcher(`/api/toss/confirm`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ paymentKey, orderId, amount: Number(amount) }),
      }),
    onSuccess: (data) => {
      toast.success('결제가 완료되었습니다.');
    },
  });
};
