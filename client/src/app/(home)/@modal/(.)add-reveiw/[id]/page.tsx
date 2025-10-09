import React, { Suspense } from 'react';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import Loading from '@/app/loading';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';
import ReviewAddModal from '@/components/Home/Profile/ReviewAddModal';
import {orderApi} from "@/libs/services/orderApi";

interface Props {
  params: { id: string; orderId: string };
}

export default function ReviewModalPage({ params }: Props) {
  const { id, orderId } = params;

  const prefetchOptions = {
    queryKey: ['order', id],
    queryFn: () => orderApi.byId(id),
  } as const;

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
