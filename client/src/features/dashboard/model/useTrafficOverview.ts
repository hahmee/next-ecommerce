// src/features/dashboard/model/useTrafficOverview.ts

﻿// src/features/dashboard/model/useTrafficOverview.ts

'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import type { DateValueType } from 'react-tailwindcss-datepicker/dist/types';

import { dashboardApi } from '@/entities/analytics/api/dashboardApi';
import { ChartFilter } from '@/entities/analytics/consts/ChartFilter';
import type { GAResponseTop } from '@/entities/analytics/model/GAResponse';
import type { DatepickType } from '@/shared/model/DatepickType';

export function useTrafficOverview(initialToday: string) {
  const today = dayjs(initialToday);
  const defaultEnd = today.subtract(1, 'day');
  const defaultStart = defaultEnd.subtract(30, 'day');
  const defaultComparedEnd = defaultStart.subtract(1, 'day');
  const defaultComparedStart = defaultComparedEnd.subtract(30, 'day');

  const [filter, setFilter] = useState<ChartFilter>(ChartFilter.DAY);

  const [date, setDate] = useState<DatepickType>({
    startDate: defaultStart.format('YYYY-MM-DD'),
    endDate: defaultEnd.format('YYYY-MM-DD'),
  });

  const [comparedDate, setComparedDate] = useState<DatepickType>({
    startDate: defaultComparedStart.format('YYYY-MM-DD'),
    endDate: defaultComparedEnd.format('YYYY-MM-DD'),
  });

  const maxDate = useMemo(() => today.toDate(), [today]);

  const { data: gaTopData } = useQuery<GAResponseTop>({
    queryKey: ['gaTop', date, filter],
    queryFn: () =>
      dashboardApi.googleAnalyticsTop({
        startDate: date.startDate,
        endDate: date.endDate,
        comparedStartDate: comparedDate.startDate,
        comparedEndDate: comparedDate.endDate,
        filter,
      }),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
    enabled: Boolean(
      date.startDate && date.endDate && comparedDate.startDate && comparedDate.endDate,
    ),
  });

  const dateChange = useCallback((value: DateValueType) => {
    if (!value?.startDate || !value?.endDate) return;
    const start = dayjs(value.startDate);
    const end = dayjs(value.endDate);
    setDate({ startDate: start.format('YYYY-MM-DD'), endDate: end.format('YYYY-MM-DD') });

    const diff = end.diff(start, 'day');
    const newEnd = start.subtract(1, 'day');
    const newStart = newEnd.subtract(diff, 'day');
    setComparedDate({
      startDate: newStart.format('YYYY-MM-DD'),
      endDate: newEnd.format('YYYY-MM-DD'),
    });
  }, []);

  const filterChange = useCallback((f: ChartFilter) => setFilter(f), []);

  const percentages = useMemo(
    () => [
      Number(gaTopData?.sessionsCompared),
      Number(gaTopData?.uniqueVisitorsCompared),
      Number(gaTopData?.avgSessionDurationCompared),
    ],
    [gaTopData],
  );

  return {
    date,
    comparedDate,
    filter,
    maxDate,
    gaTopData,
    percentages,
    dateChange,
    filterChange,
  };
}
