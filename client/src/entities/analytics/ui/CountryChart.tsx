'use client';
import React from 'react';

import { CountryChartView } from '@/components/Admin/Dashboard/Charts/CountryChartView';
import { useCountryChart } from '@/hooks/admin/dashboard/useCountryChart';
import type { DatepickType } from '@/types/DatepickType';

export default function CountryChart({ date }: { date: DatepickType }) {
  const { data: countries } = useCountryChart(date);
  return <CountryChartView countries={countries ?? []} />;
}
