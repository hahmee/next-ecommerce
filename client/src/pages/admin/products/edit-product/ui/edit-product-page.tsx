import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category';
import { Product } from '@/entities/product';
import { ProductForm } from '@/features/product/manage';
import { Mode } from '@/shared/constants/mode';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import ProductFormSkeleton from '@/shared/ui/skeletons/ProductFormSkeleton';

export function EditProductPage({ id, initialProduct }: { id: string; initialProduct?: Product }) {
  const categoryId = initialProduct?.categoryId ? String(initialProduct.categoryId) : undefined;
  const prefetchOptions = [
    {
      queryKey: ['categories'],
      queryFn: () => categoryApi.list(),
    },
    ...(categoryId
      ? [
          {
            queryKey: ['categoryPaths', categoryId],
            queryFn: () => categoryApi.paths(categoryId),
          },
        ]
      : []),
  ];

  return (
    <Suspense fallback={<ProductFormSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <ProductForm type={Mode.EDIT} id={id} initialProduct={initialProduct} />
      </PrefetchBoundary>
    </Suspense>
  );
}
