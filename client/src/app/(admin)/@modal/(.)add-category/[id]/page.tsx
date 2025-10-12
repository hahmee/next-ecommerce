'use server';

import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import AdminModal from '@/widgets/common/ui/AdminModal';
import CategoryForm from '@/features/category/manage/ui/CategoryForm';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { categoryApi } from '@/entities/category/model/service';
import { Mode } from '@/entities/common/model/mode';

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
