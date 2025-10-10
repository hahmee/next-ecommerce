'use client';

import { useQuery } from '@tanstack/react-query';

import type { GAResponseBottom } from '@/interface/GAResponse';
import { dashboardApi } from '@/libs/services/dashboardApi';
import { ChartFilter } from '@/types/chartFilter';
import type { DatepickType } from '@/types/DatepickType';

export function useTrafficBottom(
  date: DatepickType,
  comparedDate: DatepickType,
  filter: ChartFilter = ChartFilter.DAY,
) {
  return useQuery<GAResponseBottom, object, GAResponseBottom>({
    queryKey: ['ga', 'bottom', { date, comparedDate, filter }],
    queryFn: () =>
      dashboardApi.googleAnalyticsBottom({
        startDate: date.startDate,
        endDate: date.endDate,
        comparedStartDate: comparedDate.startDate,
        comparedEndDate: comparedDate.endDate,
        filter,
      }),
    enabled:
      !!date.startDate && !!date.endDate && !!comparedDate.startDate && !!comparedDate.endDate,
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });
}
