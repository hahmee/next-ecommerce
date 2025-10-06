import React, {Suspense} from 'react';
import ProductForm from '@/components/Admin/Product/ProductForm';
import {Mode} from '@/types/mode';
import {PrefetchBoundary} from '@/libs/PrefetchBoundary';
import ProductFormSkeleton from '@/components/Skeleton/ProductFormSkeleton';
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
import {categoryApi} from "@/libs/services/categoryApi";

export default function AddProductPage() {
  const prefetchOptions = [
    {
      queryKey: ['categories'],
      queryFn: () => categoryApi.list({ cache: 'no-store' }),
    },
  ];

  return (
    <Suspense fallback={<ProductFormSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <ErrorHandlingWrapper>
          <ProductForm type={Mode.ADD} />
        </ErrorHandlingWrapper>
      </PrefetchBoundary>
    </Suspense>
  );
}
