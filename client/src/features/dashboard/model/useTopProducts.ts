'use client';
import { useQuery } from '@tanstack/react-query';

import { dashboardApi } from '@/entities/analytics/model/service';
import type { TopProductResponse } from '@/entities/analytics/model/TopProductResponse';
import type { DatepickType } from '@/entities/common/model/DatepickType';

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
