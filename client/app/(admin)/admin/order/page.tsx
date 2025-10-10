import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, {Suspense} from 'react';
import {PrefetchBoundary} from '@/libs/PrefetchBoundary';
import OrderTable from '@/components/Admin/Tables/OrderTable';
import {TableSkeleton} from '@/components/Skeleton/TableSkeleton';
import {orderApi} from "@/libs/services/orderApi";


export default async function AdminOrderPage() {
  // 테이블 기간
  const date = {
    startDate: null,
    endDate: null,
  };

  const prefetchOptions = {
    queryKey: ['adminOrders', { page: 1, size: 10, search: '', date }],
    queryFn: () => orderApi.searchAdmin(1,10,'','',''),
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
