// src/widgets/admin/orders-table/ui/TopOrderTable.tsx

'use client';
import React from 'react';

import { useTopProducts } from '@/features/dashboard/model/useTopProducts';
import type { DatepickType } from '@/shared/model/DatepickType';
import { TopOrderTableView } from '@/widgets/admin/orders-table/ui/TopOrderTableView';

export default function TopOrderTable({ date }: { date: DatepickType }) {
  const { data } = useTopProducts(date);
  return <TopOrderTableView products={data ?? []} />;
}
