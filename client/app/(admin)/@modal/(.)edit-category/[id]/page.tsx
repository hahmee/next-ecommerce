import React, {Suspense} from 'react';
import CategoryForm from '@/components/Admin/Category/CategoryForm';
import {Mode} from '@/types/mode';
import {PrefetchBoundary} from '@/libs/PrefetchBoundary';
import AdminModal from '@/components/Admin/AdminModal';
import Loading from '@/app/loading';
import {categoryApi} from "@/libs/services/categoryApi";

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
