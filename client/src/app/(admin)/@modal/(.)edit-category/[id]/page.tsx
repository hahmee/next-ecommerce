import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import { categoryApi } from '@/entities/category/model/service';
import { Mode } from '@/shared/model/mode';
import CategoryForm from '@/features/category/manage/ui/CategoryForm';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import AdminModal from '@/widgets/layout/ui/AdminModal';

interface Props {
  params: { id: string };
}

export default async function CategoryEditModal({ params }: Props) {
  const { id } = params;

  const prefetchOptions = [
    {
      queryKey: ['category', id],
      queryFn: () => categoryApi.byId(id),
    },
    {
      queryKey: ['categoryPaths', id],
      queryFn: () => categoryApi.paths(id),
    },
  ];

  return (
    <AdminModal modalTitle="상품 카테고리 수정">
      <Suspense fallback={<Loading />}>
        <PrefetchBoundary prefetchOptions={prefetchOptions}>
          <CategoryForm type={Mode.EDIT} id={id} />
        </PrefetchBoundary>
      </Suspense>
    </AdminModal>
  );
}
