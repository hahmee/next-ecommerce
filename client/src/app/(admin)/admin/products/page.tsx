import React, { Suspense } from 'react';

import ProductTable from '@/widgets/admin/products-table/ui/ProductsTable';
import Breadcrumb from '@/widgets/common/ui/Breadcrumb';
import { TableSkeleton } from '@/entities/common/ui/Skeletons/TableSkeleton';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { productApi } from '@/entities/product/model/service';

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
