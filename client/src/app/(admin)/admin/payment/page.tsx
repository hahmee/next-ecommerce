import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, { Suspense } from 'react';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import PaymentOverview from '@/components/Admin/Payment/PaymentOverview';
import PaymentTable from '@/components/Admin/Tables/PaymentTable';
import { getPaymentsByEmail, getPaymentsOverview } from '@/apis/adminAPI';
import PaymentSkeleton from '@/components/Skeleton/PaymentSkeleton';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';
import dayjs from 'dayjs';

export default async function AdminPaymentPage() {
  const today = dayjs();
  const start = today.subtract(30, 'day'); // 30일 전
  const end = today; // 오늘

  // 테이블 기간
  const date = {
    startDate: start.format('YYYY-MM-DD'),
    endDate: end.format('YYYY-MM-DD'),
  };

  // 오버뷰 기간 (현재와 동일하게 설정)
  const overViewDate = {
    startDate: start.format('YYYY-MM-DD'),
    endDate: end.format('YYYY-MM-DD'),
  };

  const prefetchOptions = [
    {
      queryKey: ['adminPaymentOverview', { date: overViewDate }],
      queryFn: () =>
        getPaymentsOverview({
          startDate: date.startDate,
          endDate: date.endDate,
        }),
    },
    {
      queryKey: ['adminPayments', { page: 1, size: 10, search: '', date }],
      queryFn: () =>
        getPaymentsByEmail({
          page: 1,
          size: 10,
          search: '',
          startDate: date.startDate,
          endDate: date.endDate,
        }),
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
