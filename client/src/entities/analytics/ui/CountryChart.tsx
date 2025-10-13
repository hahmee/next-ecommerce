'use client';
import React from 'react';

import { CountryChartView } from '@/entities/analytics/ui/CountryChartView';
import type { DatepickType } from '@/entities/common/model/DatepickType';
import { useCountryChart } from '@/features/dashboard/model/useCountryChart';

export default function CountryChart({ date }: { date: DatepickType }) {
  const { data: countries } = useCountryChart(date);
  return <CountryChartView countries={countries ?? []} />;
}
