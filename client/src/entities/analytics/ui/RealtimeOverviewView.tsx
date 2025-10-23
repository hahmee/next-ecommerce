'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import type { GARealTimeResponseTop } from '@/entities/analytics';
import LazyLoadWrapper from '@/shared/ui/LazyLoadWrapper';

const ActiveVisitors = dynamic(
  () => import('@/entities/analytics').then((m) => m.ActiveVisitorsView),
  { ssr: false },
);

const ActiveVisitChart = dynamic(
  () => import('@/entities/analytics').then((m) => m.ActiveVisitChartView),
  { ssr: false },
);

const PageRoute = dynamic(() => import('@/entities/analytics').then((m) => m.PageRouteView), {
  ssr: false,
});

const RealtimeBottomOverview = dynamic(
  () => import('@/widgets/admin/dashboard-realtime').then((m) => m.RealtimeBottomOverview),
  { ssr: false },
);

export function RealtimeOverviewView(props: { gaTopData?: GARealTimeResponseTop }) {
  const { gaTopData } = props;

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      <div className="col-span-12 grid grid-cols-2 gap-4 md:gap-6 2xl:gap-7.5">
        <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full">
          <ActiveVisitors gaData={gaTopData?.activeVisitors} />
        </LazyLoadWrapper>
        <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full">
          <ActiveVisitChart chart={gaTopData?.activeVisitChart} />
        </LazyLoadWrapper>
      </div>

      <div className="col-span-12">
        <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full">
          <PageRoute gaData={gaTopData?.events} />
        </LazyLoadWrapper>
      </div>

      <div className="col-span-12">
        <LazyLoadWrapper fallback={<div>Loading additional data...</div>}>
          <RealtimeBottomOverview />
        </LazyLoadWrapper>
      </div>
    </div>
  );
}
