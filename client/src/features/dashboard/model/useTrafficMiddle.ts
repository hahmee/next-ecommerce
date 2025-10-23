// src/features/dashboard/model/useTrafficMiddle.ts

﻿// src/features/dashboard/model/useTrafficMiddle.ts



'use client';

import { useQuery } from '@tanstack/react-query';

import { dashboardApi } from '@/entities/analytics/api/dashboardApi';
import { ChartFilter } from '@/entities/analytics/consts/ChartFilter';
import type { GAResponseMiddle } from '@/entities/analytics/model/GAResponse';
import type { DatepickType } from '@/shared/model/DatepickType';

export function useTrafficMiddle(
  date: DatepickType,
  comparedDate: DatepickType,
  filter: ChartFilter = ChartFilter.DAY,
) {
  return useQuery<GAResponseMiddle, object, GAResponseMiddle>({
    queryKey: ['ga', 'middle', { date, comparedDate, filter }],
    queryFn: () =>
      dashboardApi.googleAnalyticsMiddle({
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
