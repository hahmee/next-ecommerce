import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category/model/service';
import { TableSkeleton } from '@/shared/ui/skeletons/TableSkeleton';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import CategoryTable from '@/widgets/admin/categories-table/ui/CategoryTable';
import Breadcrumb from '@/widgets/layout/ui/Breadcrumb';

export default function CategoryPage() {
  const prefetchOptions = {
    queryKey: ['adminCategories', { page: 1, size: 10, search: '' }],
    queryFn: () => categoryApi.searchAdmin(1, 10, ''),
  };

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Categories" />
      <div className="flex flex-col gap-10">
        <Suspense fallback={<TableSkeleton />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <CategoryTable />
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
