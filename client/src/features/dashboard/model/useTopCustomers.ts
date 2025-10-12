'use client';
import { useQuery } from '@tanstack/react-query';

import type { TopCustomerResponse } from '@/interface/TopCustomerResponse';
import { dashboardApi } from '@/libs/services/dashboardApi';
import type { DatepickType } from '@/types/DatepickType';

export function useTopCustomers(date: DatepickType) {
  return useQuery<TopCustomerResponse[], object, TopCustomerResponse[]>({
    queryKey: ['dashboard', 'topCustomers', date],
    queryFn: () => dashboardApi.topCustomers({ startDate: date.startDate, endDate: date.endDate }),
    enabled: !!date.startDate && !!date.endDate,
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });
}
