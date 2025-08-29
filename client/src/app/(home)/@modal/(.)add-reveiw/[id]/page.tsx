import React, { Suspense } from 'react';
import ReviewAddModal from '@/components/Home/Profile/ReviewAddModal';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import { getOrder } from '@/apis/mallAPI';
import Loading from '@/app/loading';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';

interface Props {
  params: { id: string; orderId: string };
}

export default function ReviewModalPage({ params }: Props) {
  const { id, orderId } = params;

  const prefetchOptions = {
    queryKey: ['order', id],
    queryFn: () => getOrder({ id }),
  };

  return (
    <Suspense fallback={<Loading />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <ErrorHandlingWrapper>
          <ReviewAddModal id={id} orderId={orderId} />
        </ErrorHandlingWrapper>
      </PrefetchBoundary>
    </Suspense>
  );
}
