'use server';

import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import AdminModal from '@/components/Admin/AdminModal';
import CategoryForm from '@/components/Admin/Category/CategoryForm';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import { categoryApi } from '@/libs/services/categoryApi';
import { Mode } from '@/types/mode';

interface Props {
  params: { id: string };
}

export default async function CategoryAddModal({ params }: Props) {
  const { id } = params;

  const prefetchOptions = [
    {
      queryKey: ['categoryPaths', id],
      queryFn: () => categoryApi.paths(id),
    },
  ];

  return (
    <AdminModal modalTitle="상품 카테고리 추가">
      <Suspense fallback={<Loading />}>
        <PrefetchBoundary prefetchOptions={prefetchOptions}>
          <CategoryForm type={Mode.ADD} id={id} />
        </PrefetchBoundary>
      </Suspense>
    </AdminModal>
  );
}
