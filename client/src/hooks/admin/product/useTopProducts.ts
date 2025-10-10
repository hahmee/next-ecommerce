'use client';
import { useQuery } from '@tanstack/react-query';

import type { TopProductResponse } from '@/interface/TopProductResponse';
import { dashboardApi } from '@/libs/services/dashboardApi';
import type { DatepickType } from '@/types/DatepickType';

export function useTopProducts(date: DatepickType) {
  return useQuery<TopProductResponse[], object, TopProductResponse[]>({
    queryKey: ['dashboard', 'topProducts', date],
    queryFn: () => dashboardApi.topProducts({ startDate: date.startDate, endDate: date.endDate }),
    enabled: !!date.startDate && !!date.endDate,
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });
}
