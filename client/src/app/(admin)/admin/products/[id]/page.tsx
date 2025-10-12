import React, { Suspense } from 'react';

import ProductForm from '@/features/product/manage/ui/ProductForm';
import ProductFormSkeleton from '@/entities/common/ui/Skeletons/ProductFormSkeleton';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { categoryApi } from '@/entities/category/model/service';
import { productApi } from '@/entities/product/model/service';
import { Mode } from '@/entities/common/model/mode';

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
