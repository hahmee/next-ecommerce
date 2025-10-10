'use client';
import React from 'react';

import { TopOrderTableView } from '@/components/Admin/Tables/TopOrderTableView';
import { useTopProducts } from '@/hooks/admin/product/useTopProducts';
import type { DatepickType } from '@/types/DatepickType';

export default function TopOrderTable({ date }: { date: DatepickType }) {
  const { data } = useTopProducts(date);
  return <TopOrderTableView products={data ?? []} />;
}
