import React, { Suspense } from 'react';

import ProductForm from '@/components/Admin/Product/ProductForm';
import ProductFormSkeleton from '@/components/Skeleton/ProductFormSkeleton';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import { categoryApi } from '@/libs/services/categoryApi';
import { productApi } from '@/libs/services/productApi';
import { Mode } from '@/types/mode';

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
