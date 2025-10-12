'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import type { GAResponseTop } from '@/entities/analytics/model/GAResponse';
import { ChartFilter } from '@/entities/analytics/model/chartFilter';
import type { DatepickType } from '@/entities/common/model/DatepickType';

const CardTraffic = dynamic(() => import('./CardTrafficView'), {
  ssr: true,
  loading: () => <div className="min-h-[120px]" />,
});
const TrafficSessionChart = dynamic(() => import('./Charts/TrafficSessionChartView'), {
  ssr: false,
  loading: () => <div className="min-h-[400px]">로딩중...</div>,
});
const MultiCirclesChart = dynamic(() => import('./Charts/MultiCirclesChartView'), {
  ssr: false,
  loading: () => <div className="min-h-[400px]">로딩중...</div>,
});
const TrafficMiddleOverview = dynamic(() => import('./TrafficMiddleOverview'), {
  ssr: false,
  loading: () => <div className="min-h-[400px]">로딩중...</div>,
});
const TrafficBottomOverview = dynamic(() => import('./TrafficBottomOverview'), {
  ssr: false,
  loading: () => <div className="min-h-[400px]">로딩중...</div>,
});
const AdminDatePicker = dynamic(() => import('./AdminDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: 20 }}>로딩중...</div>,
});

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
