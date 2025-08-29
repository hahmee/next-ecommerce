import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, { Suspense } from 'react';
import StockTable from '@/components/Admin/Tables/StockTable';
import { getAdminStock } from '@/apis/adminAPI';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import Loading from '@/app/loading';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';

export default function StockPage() {
  const prefetchOptions = {
    queryKey: ['adminStockProducts', { page: 1, size: 10, search: '' }],
    queryFn: () => getAdminStock({ page: 1, size: 10, search: '' }),
  };

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
