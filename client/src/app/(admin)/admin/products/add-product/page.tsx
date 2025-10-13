import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category/model/service';
import { Mode } from '@/shared/model/mode';
import ProductFormSkeleton from '@/shared/ui/skeletons/ProductFormSkeleton';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import ProductForm from '@/features/product/manage/ui/ProductForm';

export default function AddProductPage() {
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
