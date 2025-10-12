// src/components/Admin/Dashboard/RealtimeBottomOverviewView.tsx
'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import LazyLoadWrapper from '@/widgets/common/ui/LazyLoadWrapper';
import type { GARealTimeResponseBottom } from '@/entities/analytics/model/GARealTimeResponse';

const RecentVisitors = dynamic(() => import('./Charts/RecentVisitors'), { ssr: false });
const PieChart = dynamic(() => import('./Charts/PieChart'), { ssr: false });

export default function RealtimeBottomOverviewView({
  gaBottomData,
}: {
  gaBottomData?: GARealTimeResponseBottom;
}) {
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
      <div className="col-span-12 xl:col-span-6 md:gap-6 2xl:gap-7.5">
        <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full min-h-[400px]">
          <RecentVisitors gaData={gaBottomData?.recentVisitors} />
        </LazyLoadWrapper>
      </div>

      <div className="col-span-12 xl:col-span-6 md:gap-6 2xl:gap-7.5">
        <LazyLoadWrapper fallback={<div>Loading...</div>} className="h-full min-h-[400px]">
          <PieChart data={gaBottomData?.devices} title="Users by device" label="Active users" />
        </LazyLoadWrapper>
      </div>
    </div>
  );
}
