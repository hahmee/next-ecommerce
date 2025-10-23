// src/pages/home/ui/home-page.tsx

import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category/api/categoryApi';
import { productApi } from '@/entities/product/api/productApi';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import Skeleton from '@/shared/ui/skeletons/Skeleton';
import Home from '@/widgets/home/main/ui/Home';
import Slider from '@/widgets/home/main/ui/Slider';

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
