import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category/model/service';
import { TableSkeleton } from '@/entities/common/ui/Skeletons/TableSkeleton';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import CategoryTable from '@/widgets/admin/categories-table/ui/CategoryTable';
import Breadcrumb from '@/widgets/common/ui/Breadcrumb';

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
