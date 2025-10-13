import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import { productApi } from '@/entities/product/api/productApi';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import StockTable from '@/widgets/admin/stock-table/ui/StockTable';
import Breadcrumb from '@/widgets/layout/ui/Breadcrumb';

export default function StockPage() {
  const prefetchOptions = [
    {
      queryKey: ['adminStockProducts', { page: 1, size: 10, search: '' }],
      queryFn: () => productApi.searchAdmin(1, 10, '', { cache: 'no-store' }),
    },
  ];

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Stock" />
      <div className="flex flex-col gap-10">
        <Suspense fallback={<Loading />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <StockTable />
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
