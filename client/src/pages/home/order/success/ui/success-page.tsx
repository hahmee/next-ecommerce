// 결제 완료 페이지로 라우팅 시키기
import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import SuccessPayment from '@/features/payment/confirm/ui/SuccessPayment';
import { Props } from '@/app/(home)/order/success/page';

// 결제 성공 페이지
export async function OrderSuccessPage(params: Props) {
  const { paymentKey, orderId, amount } = params;

  return (
    <Suspense fallback={<Loading />}>
      <SuccessPayment paymentKey={paymentKey} orderId={orderId} amount={amount} />
    </Suspense>
  );
}
