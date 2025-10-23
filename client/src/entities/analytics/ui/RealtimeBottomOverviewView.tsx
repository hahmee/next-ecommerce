// src/entities/analytics/ui/RealtimeBottomOverviewView.tsx

﻿// src/entities/analytics/ui/RealtimeBottomOverviewView.tsx



'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import type { GARealTimeResponseBottom } from '@/entities/analytics/model/GARealTimeResponse';
import LazyLoadWrapper from '@/shared/ui/LazyLoadWrapper';

const RecentVisitors = dynamic(() => import('@/entities/analytics/ui/RecentVisitors'), {
  ssr: false,
});
const PieChart = dynamic(() => import('@/entities/analytics/ui/PieChart'), { ssr: false });

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
