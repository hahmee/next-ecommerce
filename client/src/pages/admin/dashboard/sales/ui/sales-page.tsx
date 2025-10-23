// src/pages/admin/dashboard/sales/ui/sales-page.tsx

// src/pages/admin/dashboard/sales/ui/sales-page.tsx

import dayjs from 'dayjs';
import React, { Suspense } from 'react';

import { dashboardApi } from '@/entities/analytics/api/dashboardApi';
import { ChartContext } from '@/entities/analytics/consts/ChartContext';
import { ChartFilter } from '@/entities/analytics/consts/ChartFilter';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import DashboardSkeleton from '@/shared/ui/skeletons/DashboardSkeleton';
import SalesOverview from '@/widgets/admin/dashboard-sales/ui/SalesOverview';
import Breadcrumb from '@/widgets/layout/ui/Breadcrumb';

export async function DashBoardSalesPage() {
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
