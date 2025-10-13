'use client';
import React from 'react';

import { CountryChartView } from '@/entities/analytics/ui/CountryChartView';
import { useCountryChart } from '@/features/dashboard/model/useCountryChart';
import type { DatepickType } from '@/shared/model/DatepickType';

export default function CountryChart({ date }: { date: DatepickType }) {
  const { data: countries } = useCountryChart(date);
  return <CountryChartView countries={countries ?? []} />;
}
