'use client';

import { useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import React, { useEffect } from 'react';
import { sendGAEvent } from '@next/third-parties/google';
import { useConfirmPaymentMutation } from '@/hooks/useConfirmPaymentMutation';
import toast from 'react-hot-toast';

interface Props {
  paymentKey: string;
  orderId: string;
  amount: string;
}

const SuccessPayment = ({ paymentKey, orderId, amount }: Props) => {
  const router = useRouter();
  const { mutate, isPending, isSuccess } = useConfirmPaymentMutation();

  useEffect(() => {
    if (!orderId || !paymentKey || !amount) return;
    if (isPending || isSuccess) return;

    mutate(
      { paymentKey, orderId, amount },
      {
        onSuccess: async (result) => {
          sendGAEvent('purchase', {
            transaction_id: orderId,
            value: Number(amount),
            currency: 'KRW',
            items: [
              {
                item_id: 'SKU_12345',
                item_name: 'T‑Shirt',
                item_brand: 'Brand',
                item_category: 'Apparel',
                price: 9.99,
                quantity: 3,
              },
            ],
          });

          router.replace(`/order/confirmation/${paymentKey}`);
        },
        onError: (error) => {
          console.error('결제 승인 에러:', error);
          toast.error(error.message || '결제 승인 실패');
          router.replace('/');
        },
      },
    );
  }, [paymentKey, orderId, amount, mutate, isPending, isSuccess, router]);

  return <Loading />;
};

export default SuccessPayment;
