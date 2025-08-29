'use server';

import Breadcrumb from '@/components/Breadcrumbs/Breadcrumb';
import React, { Suspense } from 'react';
import { getGoogleAnalyticsTop } from '@/apis/dashbaordAPI';
import { ChartFilter } from '@/types/chartFilter';
import dayjs from 'dayjs';
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';
import DashboardSkeleton from '@/components/Skeleton/DashboardSkeleton';
import TrafficOverview from '@/components/Admin/Dashboard/TrafficOverview';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';

export default async function DashBoardTrafficPage() {
  const today = dayjs(); // 오늘 기준
  const todayStr = today.format('YYYY-MM-DD');
  const endDate = today.subtract(1, 'day'); // 어제
  const startDate = endDate.subtract(30, 'day'); // 어제 기준 30일 전 → 총 31일치
  const comparedEndDate = startDate.subtract(1, 'day'); // 비교기간 끝
  const comparedStartDate = comparedEndDate.subtract(30, 'day'); // 비교기간 시작

  const date = {
    startDate: startDate.format('YYYY-MM-DD'),
    endDate: endDate.format('YYYY-MM-DD'),
  };

  const prefetchOptions = [
    {
      queryKey: ['gaTop', date, ChartFilter.DAY],
      queryFn: () =>
        getGoogleAnalyticsTop({
          startDate: startDate.format('YYYY-MM-DD'),
          endDate: endDate.format('YYYY-MM-DD'),
          filter: ChartFilter.DAY,
          comparedStartDate: comparedStartDate.format('YYYY-MM-DD'),
          comparedEndDate: comparedEndDate.format('YYYY-MM-DD'),
        }),
    },
  ];

  return (
    <div className="mx-auto">
      <Breadcrumb pageName="Traffic Overview" />
      <div className="flex flex-col gap-5">
        <Suspense fallback={<DashboardSkeleton />}>
          <PrefetchBoundary prefetchOptions={prefetchOptions}>
            <ErrorHandlingWrapper>
              <TrafficOverview initialToday={todayStr} />
            </ErrorHandlingWrapper>
          </PrefetchBoundary>
        </Suspense>
      </div>
    </div>
  );
}
