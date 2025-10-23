import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import { orderApi } from '@/entities/order';
import {ReviewAddModal} from '@/features/review/add';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';

interface Props {
  params: { id: string; orderId: string };
}

export function ReviewModalPage({ params }: Props) {
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
