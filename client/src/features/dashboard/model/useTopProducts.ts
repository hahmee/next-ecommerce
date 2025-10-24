'use client';
import { useQuery } from '@tanstack/react-query';

import type { TopProductResponse } from '@/entities/analytics';
import { dashboardApi } from '@/entities/analytics';
import type { DatepickType } from '@/shared/model/DatepickType';

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
