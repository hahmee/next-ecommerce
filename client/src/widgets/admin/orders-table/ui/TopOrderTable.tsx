'use client';
import React from 'react';

import { TopOrderTableView } from '@/widgets/admin/orders-table/ui/TopOrderTableView';
import { useTopProducts } from '@/features/dashboard/model/useTopProducts';
import type { DatepickType } from '@/entities/common/model/DatepickType';

export default function TopOrderTable({ date }: { date: DatepickType }) {
  const { data } = useTopProducts(date);
  return <TopOrderTableView products={data ?? []} />;
}
