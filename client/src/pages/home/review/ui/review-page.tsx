import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import { reviewApi } from '@/entities/review';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import { UserReviews } from '@/widgets/home/profile';

export async function ReviewHistoryPage() {
  const prefetchOptions = [
    {
      queryKey: ['myReviews'],
      queryFn: () => reviewApi.myReviews(),
    },
  ];

  return (
    <Suspense fallback={<Loading />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <div className="container mx-auto px-4 py-8 ">
          <div className="flex flex-col lg:flex-row gap-8 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <UserReviews />
          </div>
        </div>
      </PrefetchBoundary>
    </Suspense>
  );
}
