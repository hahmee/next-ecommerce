// app/admin/payments/page.tsx
import dayjs from 'dayjs';
import React, { Suspense } from 'react';

import PaymentSkeleton from '@/shared/ui/skeletons/PaymentSkeleton';
import { paymentApi } from '@/entities/payment/model/service';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import PaymentOverview from '@/widgets/admin/payment-overview/ui/PaymentOverview';
import PaymentTable from '@/widgets/admin/payments-table/ui/PaymentTable';
import Breadcrumb from '@/widgets/layout/ui/Breadcrumb';

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
