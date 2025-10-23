// src/pages/admin/order/ui/order-page.tsx


import React, { Suspense } from 'react';

import { orderApi } from '@/entities/order/api/orderApi';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import { TableSkeleton } from '@/shared/ui/skeletons/TableSkeleton';
import OrderTable from '@/widgets/admin/orders-table/ui/OrderTable';
import Breadcrumb from '@/widgets/layout/ui/Breadcrumb';

export async function AdminOrderPage() {
  // 테이블 기간
  const date = {
    startDate: null,
    endDate: null,
  };

  const prefetchOptions = {
    queryKey: ['adminOrders', { page: 1, size: 10, search: '', date }],
    queryFn: () => orderApi.searchAdmin(1, 10, '', '', ''),
  };

  return (
    <>
      <div className="mx-auto my-auto hd-auto">
        <Breadcrumb pageName="Orders" />
        <div className="flex flex-col gap-10 ">
          <Suspense fallback={<TableSkeleton />}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
              <OrderTable />
            </PrefetchBoundary>
          </Suspense>
        </div>
      </div>
    </>
  );
}
