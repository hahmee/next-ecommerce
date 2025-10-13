'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import type { GAResponseMiddle } from '@/entities/analytics/model/GAResponse';
import LazyLoadWrapper from '@/shared/ui/LazyLoadWrapper';
import LoadingSkeleton from '@/shared/ui/skeletons/LoadingSkeleton';

const TrafficPageChart = dynamic(() => import('@/entities/analytics/ui/TrafficPageChartView'), {
  ssr: false,
});
const TrafficSourceChart = dynamic(() => import('@/entities/analytics/ui/TrafficSourceChartView'), {
  ssr: false,
});
const PieChart = dynamic(() => import('@/entities/analytics/ui/PieChart'), { ssr: false });

export function TrafficMiddleOverviewView({ data }: { data?: GAResponseMiddle }) {
  if (!data) return <LoadingSkeleton />;

  return (
    <>
      <div className="col-span-12 mb-4 md:mb-6 2xl:mb-7.5">
        <LazyLoadWrapper fallback={<LoadingSkeleton />} className="min-h-[400px]">
          <TrafficPageChart topPages={data.topPages || []} />
        </LazyLoadWrapper>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-4">
          <LazyLoadWrapper fallback={<LoadingSkeleton />} className="min-h-[400px]">
            <PieChart
              data={data.visitors}
              title="New vs returning visitors"
              label="Site sessions"
            />
          </LazyLoadWrapper>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <LazyLoadWrapper fallback={<LoadingSkeleton />} className="min-h-[400px]">
            <PieChart data={data.devices} title="Session by device" label="Site sessions" />
          </LazyLoadWrapper>
        </div>

        <div className="col-span-12 xl:col-span-4">
          <LazyLoadWrapper fallback={<LoadingSkeleton />} className="h-full min-h-[400px]">
            <TrafficSourceChart topSources={data.topSources || []} />
          </LazyLoadWrapper>
        </div>
      </div>
    </>
  );
}
