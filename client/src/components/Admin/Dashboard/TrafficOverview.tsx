'use client';

import React, { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChartFilter } from '@/types/chartFilter';
import { getGoogleAnalyticsTop } from '@/apis/dashbaordAPI';
import { GAResponseTop } from '@/interface/GAResponse';
import { useQuery } from '@tanstack/react-query';
import { DateValueType } from 'react-tailwindcss-datepicker/dist/types';
import dayjs from 'dayjs';
import { DatepickType } from '@/types/DatepickType';
import LazyLoadWrapper from '@/components/Common/LazyLoadWrapper';

const CardTraffic = dynamic(() => import('./CardTraffic'), {
  ssr: true,
  loading: () => <div className="min-h-[120px]" />, // LCP 안정(레이아웃 고정)
});

const TrafficSessionChart = dynamic(() => import('./Charts/TrafficSessionChart'), {
  ssr: false,
  loading: () => <div className="min-h-[400px]"> 로딩중...</div>,
});
const MultiCirclesChart = dynamic(() => import('./Charts/MultiCirclesChart'), {
  ssr: false,
  loading: () => <div className="min-h-[400px]"> 로딩중...</div>,
});
const TrafficMiddleOverview = dynamic(() => import('./TrafficMiddleOverview'), {
  ssr: false,
  loading: () => <div className="min-h-[400px]"> 로딩중...</div>,
});
const TrafficBottomOverview = dynamic(() => import('./TrafficBottomOverview'), {
  ssr: false,
  loading: () => <div className="min-h-[400px]"> 로딩중...</div>,
});

const AdminDatePicker = dynamic(() => import('./AdminDatePicker'), {
  ssr: false,
  loading: () => <div style={{ height: 20 }}> 로딩중...</div>,
});

const TrafficOverview = ({ initialToday }: { initialToday: string }) => {
  const defaultToday = dayjs(initialToday);
  const defaultEnd = defaultToday.subtract(1, 'day');
  const defaultStart = defaultEnd.subtract(30, 'day');
  const defaultComparedEnd = defaultStart.subtract(1, 'day');
  const defaultComparedStart = defaultComparedEnd.subtract(30, 'day');

  const [currentFilter, setCurrentFilter] = useState<ChartFilter>(ChartFilter.DAY);

  const [date, setDate] = useState<DatepickType>({
    startDate: defaultStart.format('YYYY-MM-DD'),
    endDate: defaultEnd.format('YYYY-MM-DD'),
  });

  const [comparedDate, setComparedDate] = useState<DatepickType>({
    startDate: defaultComparedStart.format('YYYY-MM-DD'),
    endDate: defaultComparedEnd.format('YYYY-MM-DD'),
  });

  const maxDate = useMemo(() => defaultToday.toDate(), []);

  const { data: gaTopData } = useQuery<GAResponseTop, Object, GAResponseTop>({
    queryKey: ['gaTop', date, currentFilter],
    queryFn: () =>
      getGoogleAnalyticsTop({
        startDate: date.startDate,
        endDate: date.endDate,
        filter: currentFilter,
        comparedStartDate: comparedDate.startDate,
        comparedEndDate: comparedDate.endDate,
      }),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: true,
    enabled:
      !!date.startDate && !!date.endDate && !!comparedDate.startDate && !!comparedDate.endDate,
  });

  const dateChange = useCallback((value: DateValueType) => {
    if (!value?.startDate || !value?.endDate) return;

    const start = dayjs(value.startDate);
    const end = dayjs(value.endDate);

    setDate({
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
    });

    const diff = end.diff(start, 'day');
    const newEnd = start.subtract(1, 'day');
    const newStart = newEnd.subtract(diff, 'day');

    setComparedDate({
      startDate: newStart.format('YYYY-MM-DD'),
      endDate: newEnd.format('YYYY-MM-DD'),
    });
  }, []);

  const filterChange = useCallback((filter: ChartFilter) => {
    setCurrentFilter(filter);
  }, []);

  const percentages = useMemo(
    () => [
      Number(gaTopData?.sessionsCompared),
      Number(gaTopData?.uniqueVisitorsCompared),
      Number(gaTopData?.avgSessionDurationCompared),
    ],
    [gaTopData],
  );

  return (
    <>
      <div>
        <AdminDatePicker date={date} dateChange={dateChange} maxDate={maxDate} />
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-200">
          compared to previous period ({comparedDate.startDate} ~ {comparedDate.endDate})
        </p>
      </div>
      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <div className="col-span-12 xl:col-span-8">
          <CardTraffic gaData={gaTopData} />
          <TrafficSessionChart
            chart={gaTopData?.sessionChart}
            filterChange={filterChange}
            filter={currentFilter}
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
          <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
            <TrafficMiddleOverview date={date} comparedDate={comparedDate} />
          </LazyLoadWrapper>
        </div>

        <div className="col-span-12">
          <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
            <TrafficBottomOverview date={date} comparedDate={comparedDate} />
          </LazyLoadWrapper>
        </div>
      </div>
    </>
  );
};

export default TrafficOverview;
