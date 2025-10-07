'use client';
import React from 'react';
import type { DatepickType } from '@/types/DatepickType';
import {useTopCustomers} from "@/hooks/useTopCustomers";
import {TopCustomersView} from "@/components/Admin/Dashboard/TopCustomersView";

export default function TopCustomers({ date }: { date: DatepickType }) {
  const { data } = useTopCustomers(date);
  return <TopCustomersView customers={data ?? []} />;
}
