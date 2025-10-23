import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import { paymentApi } from '@/entities/payment/api/paymentApi';
import Confirm from '@/features/payment/confirm/ui/Confirm';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';

// 결제 성공 페이지
export async function ConfirmPage({ paymentKey }: { paymentKey: string }) {
  // 결제 요청이 토스페이먼츠로 전송되고 성공했을 때 url로 orderId, paymentKey, amount가 나오는데 그 값들을 스프링으로 넘겨준다.
  const prefetchOptions = [
    {
      queryKey: ['payment-confirm', paymentKey],
      queryFn: () => paymentApi.byKey(paymentKey),
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <Confirm paymentKey={paymentKey} />
      </PrefetchBoundary>
    </Suspense>
  );
}
