'use client';

import { useQuery } from '@tanstack/react-query';

import { ChartFilter } from '@/entities/analytics/model/chartFilter';
import type { GAResponseBottom } from '@/entities/analytics/model/GAResponse';
import { dashboardApi } from '@/entities/analytics/model/service';
import type { DatepickType } from '@/shared/model/DatepickType';

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
