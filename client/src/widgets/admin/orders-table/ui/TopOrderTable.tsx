'use client';
import React from 'react';

import type { DatepickType } from '@/entities/common/model/DatepickType';
import { useTopProducts } from '@/features/dashboard/model/useTopProducts';
import { TopOrderTableView } from '@/widgets/admin/orders-table/ui/TopOrderTableView';

export default function TopOrderTable({ date }: { date: DatepickType }) {
  const { data } = useTopProducts(date);
  return <TopOrderTableView products={data ?? []} />;
}
