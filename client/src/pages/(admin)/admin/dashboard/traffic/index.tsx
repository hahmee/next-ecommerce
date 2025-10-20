// src/pages/(admin)/admin/dashboard/traffic/index.tsx

import dayjs from 'dayjs';
import React, { Suspense } from 'react';

import { dashboardApi } from '@/entities/analytics/api/dashboardApi';
import { ChartFilter } from '@/entities/analytics/consts/ChartFilter';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import DashboardSkeleton from '@/shared/ui/skeletons/DashboardSkeleton';
import TrafficOverview from '@/widgets/admin/dashboard-traffic/ui/TrafficOverview';
import Breadcrumb from '@/widgets/layout/ui/Breadcrumb';

export default async function DashBoardTrafficPage() {
  const today = dayjs();
  const initialToday = today.format('YYYY-MM-DD');

  const end = today.subtract(1, 'day');
  const start = end.subtract(30, 'day');
  const comparedEnd = start.subtract(1, 'day');
  const comparedStart = comparedEnd.subtract(30, 'day');

  const prefetchOptions = [
    {
      queryKey: [
        'gaTop',
        { start: start.format('YYYY-MM-DD'), end: end.format('YYYY-MM-DD') },
        ChartFilter.DAY,
      ],
      queryFn: () =>
        dashboardApi.googleAnalyticsTop(
          {
            startDate: start.format('YYYY-MM-DD'),
            endDate: end.format('YYYY-MM-DD'),
            comparedStartDate: comparedStart.format('YYYY-MM-DD'),
            comparedEndDate: comparedEnd.format('YYYY-MM-DD'),
            filter: ChartFilter.DAY,
          },
          { next: { revalidate: 60, tags: ['gaTop'] } },
        ),
    },
  ];

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Traffic Overview" />
      <div className="flex flex-col gap-5">
        <Suspense fallback={<DashboardSkeleton />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <TrafficOverview initialToday={initialToday} />
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
