// src/pages/admin/category/modal/add-category/ui/category-add-modal-page.tsx

'use server';

import { Suspense } from 'react';

import Loading from '@/app/loading';
import { categoryApi } from '@/entities/category/api/categoryApi';
import CategoryForm from '@/features/category/manage/ui/CategoryForm';
import { Mode } from '@/shared/constants/mode';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import AdminModal from '@/widgets/layout/ui/AdminModal';


export async function CategoryAddModalPage({ id }: { id: string }) {

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