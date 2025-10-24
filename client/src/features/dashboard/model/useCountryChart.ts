'use client';
import { useQuery } from '@tanstack/react-query';

import type { MapResponse } from '@/entities/analytics';
import { dashboardApi } from '@/entities/analytics';
import type { DatepickType } from '@/shared/model/DatepickType';

export function useCountryChart(date: DatepickType) {
  return useQuery<MapResponse[], object, MapResponse[]>({
    queryKey: ['dashboard', 'countries', date],
    queryFn: () =>
      dashboardApi.salesByCountry({ startDate: date.startDate, endDate: date.endDate }),
    enabled: !!date.startDate && !!date.endDate,
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });
}
