'use client';
import React from 'react';

import { TopCustomersView } from '@/components/Admin/Dashboard/TopCustomersView';
import { useTopCustomers } from '@/hooks/admin/dashboard/useTopCustomers';
import type { DatepickType } from '@/types/DatepickType';

export default function TopCustomers({ date }: { date: DatepickType }) {
  const { data } = useTopCustomers(date);
  return <TopCustomersView customers={data ?? []} />;
}
