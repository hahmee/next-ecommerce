'use client';
import React from 'react';

import { TopCustomersView } from '@/entities/analytics/ui/TopCustomersView';
import type { DatepickType } from '@/shared/model/DatepickType';
import { useTopCustomers } from '@/features/dashboard/model/useTopCustomers';

export default function TopCustomers({ date }: { date: DatepickType }) {
  const { data } = useTopCustomers(date);
  return <TopCustomersView customers={data ?? []} />;
}
