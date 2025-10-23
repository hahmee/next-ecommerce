import React, { Suspense } from 'react';

import { productApi } from '@/entities/product';
import { ProductSingle } from '@/entities/product';
import { reviewApi } from '@/entities/review';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import ProductSingleSkeleton from '@/shared/ui/skeletons/ProductSingleSkeleton';

export async function ProductSinglePage({ id }: { id: string }) {
  const prefetchOptions = [
    {
      queryKey: ['productCustomerSingle', id],
      queryFn: () =>
        productApi.byIdPublic(id, {
          next: { revalidate: 60, tags: ['productCustomerSingle', id] },
        }),
    },
    {
      queryKey: ['reviews', id],
      queryFn: () =>
        reviewApi.listByProduct(id, {
          next: { revalidate: 60, tags: ['reviews', id] },
        }),
    },
  ];

  return (
    <Suspense fallback={<ProductSingleSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <ProductSingle id={id} />
      </PrefetchBoundary>
    </Suspense>
  );
}
