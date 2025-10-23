import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category';
import { productApi } from '@/entities/product';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import Skeleton from '@/shared/ui/skeletons/Skeleton';
import Home from '@/widgets/home/main';
import Slider from '@/widgets/home/main';

export const HomePage = () => {
  const prefetchOptions = [
    { queryKey: ['categories'], queryFn: () => categoryApi.list() },
    { queryKey: ['expert-products'], queryFn: () => productApi.expertList() },
    { queryKey: ['new-products'], queryFn: () => productApi.newList() },
    { queryKey: ['featured-products'], queryFn: () => productApi.featuredList() },
  ];

  return (
    <div>
      <Slider />
      <Suspense fallback={<Skeleton />}>
        <PrefetchBoundary prefetchOptions={prefetchOptions}>
          <Home />
        </PrefetchBoundary>
      </Suspense>
    </div>
  );
};
