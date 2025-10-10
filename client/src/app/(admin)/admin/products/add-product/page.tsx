import React, { Suspense } from 'react';

import ProductForm from '@/components/Admin/Product/ProductForm';
import ProductFormSkeleton from '@/components/Skeleton/ProductFormSkeleton';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import { categoryApi } from '@/libs/services/categoryApi';
import { Mode } from '@/types/mode';

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
