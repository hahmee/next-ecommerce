'use client';
import React from 'react';

import { TopCustomersView } from '@/entities/analytics/ui/TopCustomersView';
import { useTopCustomers } from '@/features/dashboard/model/useTopCustomers';
import type { DatepickType } from '@/shared/model/DatepickType';

export function TopCustomers({ date }: { date: DatepickType }) {
  const { data } = useTopCustomers(date);
  return <TopCustomersView customers={data ?? []} />;
}
