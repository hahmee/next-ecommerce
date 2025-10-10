// app/admin/payments/page.tsx
import dayjs from 'dayjs';
import React, { Suspense } from 'react';

import PaymentOverview from '@/components/Admin/Payment/PaymentOverview';
import PaymentTable from '@/components/Admin/Tables/PaymentTable';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import PaymentSkeleton from '@/components/Skeleton/PaymentSkeleton';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import { paymentApi } from '@/libs/services/paymentApi';

export default async function AdminPaymentPage() {
  const today = dayjs();
  const start = today.subtract(30, 'day');
  const date = {
    startDate: start.format('YYYY-MM-DD'),
    endDate: today.format('YYYY-MM-DD'),
  };

  const prefetchOptions = [
    {
      queryKey: ['adminPaymentOverview', { date }],
      queryFn: () => paymentApi.overview(date.startDate, date.endDate, { cache: 'no-store' }),
    },
    {
      queryKey: ['adminPayments', { page: 1, size: 10, search: '', date }],
      queryFn: () =>
        paymentApi.searchAdmin(1, 10, '', date.startDate, date.endDate, { cache: 'no-store' }),
    },
  ];

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Payments" />
      <div className="flex flex-col gap-10">
        <Suspense fallback={<PaymentSkeleton />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
              <div className="col-span-12">
                <PaymentOverview />
                <PaymentTable />
              </div>
            </div>
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
