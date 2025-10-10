'use client';
import React from 'react';
import type { DatepickType } from '@/types/DatepickType';
import {useTopProducts} from "@/hooks/admin/useTopProducts";
import {TopOrderTableView} from "@/components/Admin/Tables/TopOrderTableView";


export default function TopOrderTable({ date }: { date: DatepickType }) {
  const { data } = useTopProducts(date);
  return <TopOrderTableView products={data ?? []} />;
}
