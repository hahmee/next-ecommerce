import React, { Suspense } from 'react';

import ProductTable from '@/components/Admin/Tables/ProductTable';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { TableSkeleton } from '@/components/Skeleton/TableSkeleton';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import { productApi } from '@/entities/product/api/productApi';

export default async function ProductsPage() {
  const prefetchOptions = {
    queryKey: ['adminProducts', { page: 1, size: 10, search: '' }],
    queryFn: () => productApi.searchAdmin(1, 10, ''),
  };

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Products" />
      <div className="flex flex-col gap-10">
        <Suspense fallback={<TableSkeleton />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <ProductTable />
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
