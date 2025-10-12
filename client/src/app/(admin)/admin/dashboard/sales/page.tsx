import dayjs from 'dayjs';
import React, { Suspense } from 'react';

import SalesOverview from '@/entities/analytics/ui/SalesOverview';
import Breadcrumb from '@/widgets/common/ui/Breadcrumb';
import DashboardSkeleton from '@/entities/common/ui/Skeletons/DashboardSkeleton';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { dashboardApi } from '@/entities/analytics/model/service';
import { ChartContext } from '@/entities/analytics/model/chartContext';
import { ChartFilter } from '@/entities/analytics/model/chartFilter';

export default async function DashBoardSalesPage() {
  const today = dayjs(); // 오늘
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
            <SalesOverview initialToday={today.format('YYYY-MM-DD')} />
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
