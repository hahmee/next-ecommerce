import React, { Suspense } from 'react';

import CategoryTable from '@/components/Admin/Tables/CategoryTable';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { TableSkeleton } from '@/components/Skeleton/TableSkeleton';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import { categoryApi } from '@/libs/services/categoryApi';

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
