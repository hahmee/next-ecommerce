import React, { Suspense } from 'react';

import { productApi } from '@/entities/product';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import { TableSkeleton } from '@/shared/ui/skeletons/TableSkeleton';
import ProductTable from '@/widgets/admin/products-table/ui/ProductsTable';
import Breadcrumb from '@/widgets/layout/ui/Breadcrumb';

export async function ProductsPage() {
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
