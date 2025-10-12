import React, { Suspense } from 'react';

import OrderTable from '@/widgets/admin/orders-table/ui/OrderTable';
import Breadcrumb from '@/widgets/common/ui/Breadcrumb';
import { TableSkeleton } from '@/entities/common/ui/Skeletons/TableSkeleton';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { orderApi } from '@/entities/order/model/service';

export default async function AdminOrderPage() {
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
