import React, { Suspense } from 'react';

import { TableSkeleton } from '@/entities/common/ui/Skeletons/TableSkeleton';
import { productApi } from '@/entities/product/model/service';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import ProductTable from '@/widgets/admin/products-table/ui/ProductsTable';
import Breadcrumb from '@/widgets/common/ui/Breadcrumb';

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
