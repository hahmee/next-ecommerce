'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useState } from 'react';

import { dashboardApi } from '@/entities/analytics/api/dashboardApi';
import { ChartFilter } from '@/entities/analytics/consts/ChartFilter';
import type { GARealTimeResponseTop } from '@/entities/analytics/model/GARealTimeResponse';

export function useRealtimeOverview() {
  const today = dayjs();
  const end = today;
  const start = end.subtract(30, 'day');
  const comparedEnd = start.subtract(1, 'day');
  const comparedStart = comparedEnd.subtract(30, 'day');

  const [currentFilter] = useState<ChartFilter>(ChartFilter.DAY);
  const [date] = useState({
    startDate: start.format('YYYY-MM-DD'),
    endDate: end.format('YYYY-MM-DD'),
  });
  const [comparedDate] = useState({
    startDate: comparedStart.format('YYYY-MM-DD'),
    endDate: comparedEnd.format('YYYY-MM-DD'),
  });

  const { data: gaTopData } = useQuery<GARealTimeResponseTop>({
    queryKey: ['gaRecentUsersTop', date, currentFilter],
    queryFn: () =>
      dashboardApi.recentUsersTop({
        startDate: date.startDate,
        endDate: date.endDate,
        filter: currentFilter,
        comparedStartDate: comparedDate.startDate,
        comparedEndDate: comparedDate.endDate,
      }),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  return { gaTopData };
}
