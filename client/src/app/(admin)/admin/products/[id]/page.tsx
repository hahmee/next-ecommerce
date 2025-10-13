import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category/model/service';
import { Mode } from '@/shared/model/mode';
import ProductFormSkeleton from '@/shared/ui/skeletons/ProductFormSkeleton';
import { productApi } from '@/entities/product/model/service';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import ProductForm from '@/features/product/manage/ui/ProductForm';

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
