import React, { Suspense } from 'react';

import ProductForm from '@/features/product/manage/ui/ProductForm';
import ProductFormSkeleton from '@/entities/common/ui/Skeletons/ProductFormSkeleton';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { categoryApi } from '@/entities/category/model/service';
import { Mode } from '@/entities/common/model/mode';

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
