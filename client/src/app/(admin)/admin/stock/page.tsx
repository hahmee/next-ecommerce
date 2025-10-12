import React, { Suspense } from 'react';

import Loading from '@/app/loading';
import StockTable from '@/widgets/admin/stock-table/ui/StockTable';
import Breadcrumb from '@/widgets/common/ui/Breadcrumb';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { productApi } from '@/entities/product/model/service';

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
