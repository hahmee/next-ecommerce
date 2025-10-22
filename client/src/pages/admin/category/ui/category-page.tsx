// src/pages/admin/category/ui/category-page.tsx



import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category/api/categoryApi';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import { TableSkeleton } from '@/shared/ui/skeletons/TableSkeleton';
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
