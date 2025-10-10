import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, {Suspense} from 'react';
import {PrefetchBoundary} from '@/libs/PrefetchBoundary';
import CategoryTable from '@/components/Admin/Tables/CategoryTable';
import {TableSkeleton} from '@/components/Skeleton/TableSkeleton';

import {categoryApi} from "@/libs/services/categoryApi";

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
