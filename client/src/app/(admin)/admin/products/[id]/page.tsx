import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category/api/categoryApi';
import { productApi } from '@/entities/product/api/productApi';
import ProductForm from '@/features/product/manage/ui/ProductForm';
import { Mode } from '@/shared/constants/mode';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import ProductFormSkeleton from '@/shared/ui/skeletons/ProductFormSkeleton';

interface Props {
  params: { id: string };
}

export default async function ModifyProductPage({ params }: Props) {
  const { id } = params;

  const prefetchOptions = [
    {
      queryKey: ['productSingle', id],
      queryFn: () => productApi.byId(id, { next: { revalidate: 60, tags: ['productSingle', id] } }),
    },
    {
      queryKey: ['categories'],
      queryFn: () => categoryApi.list(),
    },
    {
      queryKey: ['categoryPaths', id],
      queryFn: () => categoryApi.paths(id),
    },
  ];

  return (
    <Suspense fallback={<ProductFormSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <ProductForm type={Mode.EDIT} id={id} />
      </PrefetchBoundary>
    </Suspense>
  );
}
