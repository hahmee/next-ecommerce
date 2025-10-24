'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import type { GAResponseTop } from '@/entities/analytics';
import { ChartFilter } from '@/entities/analytics';
import type { DatepickType } from '@/shared/model/DatepickType';

const CardTraffic = dynamic(
  () => import('@/entities/analytics/ui').then((mod) => mod.CardTrafficView),
  { ssr: true, loading: () => <div className="min-h-[120px]" /> },
);

const TrafficSessionChart = dynamic(
  () => import('@/entities/analytics/ui').then((mod) => mod.TrafficSessionChartView),
  { ssr: false, loading: () => <div className="min-h-[400px]">로딩중...</div> },
);

const MultiCirclesChart = dynamic(
  () => import('@/entities/analytics/ui').then((mod) => mod.MultiCirclesChartView),
  { ssr: false, loading: () => <div className="min-h-[400px]">로딩중...</div> },
);

const TrafficMiddleOverview = dynamic(
  () => import('@/widgets/admin/dashboard-traffic').then((mod) => mod.TrafficMiddleOverview),
  { ssr: false, loading: () => <div className="min-h-[400px]">로딩중...</div> },
);

const TrafficBottomOverview = dynamic(
  () => import('@/widgets/admin/dashboard-traffic').then((mod) => mod.TrafficBottomOverview),
  { ssr: false, loading: () => <div className="min-h-[400px]">로딩중...</div> },
);

const AdminDatePicker = dynamic(
  () => import('@/entities/analytics/ui').then((mod) => mod.AdminDatePicker),
  { ssr: false, loading: () => <div style={{ height: 20 }}>로딩중...</div> },
);

export function TrafficOverviewView(props: {
  date: DatepickType;
  comparedDate: DatepickType;
  maxDate: Date;
  filter: ChartFilter;
  gaTopData?: GAResponseTop;
  percentages: number[];
  onDateChange: (v: any) => void;
  onFilterChange: (f: ChartFilter) => void;
}) {
  const {
    date,
    comparedDate,
    maxDate,
    filter,
    gaTopData,
    percentages,
    onDateChange,
    onFilterChange,
  } = props;

  return (
    <>
      <div>
        <AdminDatePicker date={date} dateChange={onDateChange} maxDate={maxDate} />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-200">
          compared to previous period ({comparedDate.startDate} ~ {comparedDate.endDate})
        </p>
      </div>

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <CardTraffic gaData={gaTopData} />
          <TrafficSessionChart
            chart={gaTopData?.sessionChart}
            filter={filter}
            filterChange={onFilterChange}
          />
        </div>

        <div className="col-span-12 xl:col-span-4">
          <MultiCirclesChart
            percentages={percentages}
            title="Traffic Target"
            labels={['Site sessions', 'Unique visitors', 'ASD']}
            total={gaTopData?.sessions || ''}
          />
        </div>

        <div className="col-span-12">
          <TrafficMiddleOverview date={date} comparedDate={comparedDate} />
        </div>

        <div className="col-span-12">
          <TrafficBottomOverview date={date} comparedDate={comparedDate} />
        </div>
      </div>
    </>
  );
}
