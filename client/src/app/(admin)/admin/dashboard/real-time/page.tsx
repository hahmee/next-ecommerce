'use server';

import dayjs from 'dayjs';
import React, { Suspense } from 'react';

import { dashboardApi } from '@/entities/analytics/api/dashboardApi';
import { ChartFilter } from '@/entities/analytics/consts/ChartFilter';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import DashboardSkeleton from '@/shared/ui/skeletons/DashboardSkeleton';
import RealtimeOverview from '@/widgets/admin/dashboard-realtime/ui/RealtimeOverview';
import Breadcrumb from '@/widgets/layout/ui/Breadcrumb';

export default async function DashBoardRealTimePage() {
  const today = dayjs();
  const end = today;
  const start = end.subtract(30, 'day');
  const comparedEnd = start.subtract(1, 'day');
  const comparedStart = comparedEnd.subtract(30, 'day');

  const date = {
    startDate: start.format('YYYY-MM-DD'),
    endDate: end.format('YYYY-MM-DD'),
  };

  const prefetchOptions = [
    {
      queryKey: ['gaRecentUsersTop', date, ChartFilter.DAY],
      queryFn: () =>
        dashboardApi.recentUsersTop({
          startDate: date.startDate,
          endDate: date.endDate,
          filter: ChartFilter.DAY,
          comparedStartDate: comparedStart.format('YYYY-MM-DD'),
          comparedEndDate: comparedEnd.format('YYYY-MM-DD'),
        }),
    },
  ];

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Real-time Overview" />
      <div className="flex flex-col gap-5">
        <Suspense fallback={<DashboardSkeleton />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <RealtimeOverview />
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
