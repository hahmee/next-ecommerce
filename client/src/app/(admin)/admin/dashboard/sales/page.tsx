import React, { Suspense } from 'react';
import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import DashboardSkeleton from '@/components/Skeleton/DashboardSkeleton';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';
import dayjs from 'dayjs';
import SalesOverview from '@/components/Admin/Dashboard/SalesOverview';
import { ChartFilter } from '@/types/chartFilter';
import { ChartContext } from '@/types/chartContext';
import { dashboardApi } from '@/libs/services/dashboardApi';

export default async function DashBoardSalesPage() {
  const today = dayjs();                     // 오늘
  const startDate = today.subtract(4, 'month');
  const comparedEndDate = startDate.subtract(1, 'day');
  const comparedStartDate = comparedEndDate.subtract(4, 'month');

  const date = {
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: today.format('YYYY-MM-DD'),
  };

  const prefetchOptions = [
    {
      queryKey: ['salesCards', ChartFilter.DAY, date, ChartContext.TOPSALES],
      queryFn: () =>
        dashboardApi.salesCards({
          startDate: date.startDate,
          endDate: date.endDate,
          filter: ChartFilter.DAY,
          comparedStartDate: comparedStartDate.format('YYYY-MM-DD'),
          comparedEndDate: comparedEndDate.format('YYYY-MM-DD'),
          context: ChartContext.TOPSALES,
        }),
    },
    {
      queryKey: ['salesCharts', ChartFilter.DAY, date, ChartContext.TOPSALES],
      queryFn: () =>
        dashboardApi.salesCharts({
          startDate: date.startDate,
          endDate: date.endDate,
          filter: ChartFilter.DAY,
          comparedStartDate: comparedStartDate.format('YYYY-MM-DD'),
          comparedEndDate: comparedEndDate.format('YYYY-MM-DD'),
          context: ChartContext.TOPSALES,
        }),
    },
  ];

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Sales Overview" />
      <div className="flex flex-col gap-5">
        <Suspense fallback={<DashboardSkeleton />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <ErrorHandlingWrapper>
              <SalesOverview initialToday={today.format('YYYY-MM-DD')} />
            </ErrorHandlingWrapper>
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
