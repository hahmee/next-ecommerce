// src/features/payment/confirm/ui/SuccessPayment.tsx



'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

import Loading from '@/app/loading';
import { useConfirmPaymentMutation } from '@/features/payment/confirm/model/useConfirmPaymentMutation';
import { SessionExpiredError } from '@/shared/lib/errors';

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
          // 세션 만료는 전역에서 상태 리셋/리다이렉트 처리 > 여기서 아무 것도 하지 않음
          if (error instanceof SessionExpiredError) return;
          // 그 외 실패는 홈 등으로 안전 이동만
          router.replace('/');
        },
      },
    );
  }, [paymentKey, orderId, amount, mutate, isPending, isSuccess, router]);

  return <Loading />;
};

export default SuccessPayment;
