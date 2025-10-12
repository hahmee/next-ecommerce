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
