// src/pages/home/order/ui/order-page.tsx

import React, { Suspense } from 'react';
import { orderApi } from '@/entities/order/api/orderApi';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import OrderDetailSkeleton from '@/shared/ui/skeletons/OrderDetailSkeleton';
import OrderDetail from '@/widgets/home/profile/ui/OrderDetail';

export async function OrderPage({ orderId }: { orderId: string }) {

  const prefetchOptions = [
    {
      queryKey: ['orders', orderId],
      queryFn: () => orderApi.listByOrderId(orderId),
    },
  ];

  return (
    <Suspense fallback={<OrderDetailSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <OrderDetail orderId={orderId} />
      </PrefetchBoundary>
    </Suspense>
  );
}
