import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category';
import ProductForm from '@/features/product/manage/ui/ProductForm';
import { Mode } from '@/shared/constants/mode';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import ProductFormSkeleton from '@/shared/ui/skeletons/ProductFormSkeleton';

export function AddProductPage() {
  const prefetchOptions = [
    {
      queryKey: ['categories'],
      queryFn: () => categoryApi.list(),
    },
  ];

  return (
    <Suspense fallback={<ProductFormSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <ProductForm type={Mode.ADD} />
      </PrefetchBoundary>
    </Suspense>
  );
}
