'use client';

import { useQuery } from '@tanstack/react-query';
import type { GAResponseMiddle } from '@/interface/GAResponse';
import type { DatepickType } from '@/types/DatepickType';
import { ChartFilter } from '@/types/chartFilter';
import {dashboardApi} from "@/libs/services/dashboardApi";

export function useTrafficMiddle(date: DatepickType, comparedDate: DatepickType, filter: ChartFilter = ChartFilter.DAY) {
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
    enabled: !!date.startDate && !!date.endDate && !!comparedDate.startDate && !!comparedDate.endDate,
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
  });
}
