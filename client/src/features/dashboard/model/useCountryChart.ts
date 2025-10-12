'use client';
import { useQuery } from '@tanstack/react-query';

import type { MapResponse } from '@/interface/MapResponse';
import { dashboardApi } from '@/libs/services/dashboardApi';
import type { DatepickType } from '@/types/DatepickType';

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
