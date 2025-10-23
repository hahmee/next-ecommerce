import React, { Suspense } from 'react';

import { paymentApi } from '@/entities/payment/api/paymentApi';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import ShoppingSkeleton from '@/shared/ui/skeletons/ShoppingSkeleton';
import UserOrders from '@/widgets/home/profile/ui/UserOrders';

export async function OrderHistoryPage() {
  const prefetchOptions = [
    {
      queryKey: ['payments'],
      queryFn: () => paymentApi.list(),
    },
  ];

  return (
    <Suspense fallback={<ShoppingSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <div className="container mx-auto px-4 py-8 ">
          <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <UserOrders />
          </div>
        </div>
      </PrefetchBoundary>
    </Suspense>
  );
}
