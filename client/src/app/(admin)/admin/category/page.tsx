import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, { Suspense } from 'react';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import CategoryTable from '@/components/Admin/Tables/CategoryTable';
import { getAdminCategories } from '@/apis/adminAPI';
import { TableSkeleton } from '@/components/Skeleton/TableSkeleton';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';

export default function CategoryPage() {
  const prefetchOptions = {
    queryKey: ['adminCategories', { page: 1, size: 10, search: '' }],
    queryFn: () => getAdminCategories({ page: 1, size: 10, search: '' }),
  };

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Categories" />
      <div className="flex flex-col gap-10">
        <Suspense fallback={<TableSkeleton />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <ErrorHandlingWrapper>
              <CategoryTable />
            </ErrorHandlingWrapper>
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
