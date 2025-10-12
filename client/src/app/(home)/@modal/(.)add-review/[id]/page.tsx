import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import ReviewAddModal from '@/features/review/add/ui/ReviewAddModal';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { orderApi } from '@/entities/order/model/service';

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
        <ReviewAddModal id={id} orderId={orderId} />
      </PrefetchBoundary>
    </Suspense>
  );
}
