// app/admin/stock/page.tsx
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, { Suspense } from 'react';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';
import Loading from '@/app/loading';
import StockTable from '@/components/Admin/Tables/StockTable';
import { productApi } from '@/libs/services/productApi';

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
            <ErrorHandlingWrapper>
              <StockTable />
            </ErrorHandlingWrapper>
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
