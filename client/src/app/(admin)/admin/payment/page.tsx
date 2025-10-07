// app/admin/payments/page.tsx
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, { Suspense } from 'react';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import PaymentOverview from '@/components/Admin/Payment/PaymentOverview';
import PaymentTable from '@/components/Admin/Tables/PaymentTable';
import PaymentSkeleton from '@/components/Skeleton/PaymentSkeleton';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';
import dayjs from 'dayjs';
import { paymentsApi } from '@/libs/services/paymentsApi';

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
      queryFn: () => paymentsApi.overview(date.startDate, date.endDate, { cache: 'no-store' }),
    },
    {
      queryKey: ['adminPayments', { page: 1, size: 10, search: '', date }],
      queryFn: () => paymentsApi.searchAdmin(1, 10, '', date.startDate, date.endDate, { cache: 'no-store' }),
    },
  ];

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Payments" />
      <div className="flex flex-col gap-10">
        <Suspense fallback={<PaymentSkeleton />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <ErrorHandlingWrapper>
              <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
                <div className="col-span-12">
                  <PaymentOverview />
                  <PaymentTable />
                </div>
              </div>
            </ErrorHandlingWrapper>
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
