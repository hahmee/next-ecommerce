import { Suspense } from 'react';

import Loading from '@/app/loading';
import { categoryApi } from '@/entities/category';
import CategoryForm from '@/features/category/manage';
import { Mode } from '@/shared/constants/mode';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import AdminModal from '@/widgets/layout';

export async function CategoryEditModalPage({ id }: { id: string }) {
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
