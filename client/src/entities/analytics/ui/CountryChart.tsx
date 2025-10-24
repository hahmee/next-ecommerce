'use client';
import React from 'react';

import { CountryChartView } from '@/entities/analytics/ui';
import { useCountryChart } from '@/features/dashboard';
import type { DatepickType } from '@/shared/model/DatepickType';

export function CountryChart({ date }: { date: DatepickType }) {
  const { data: countries } = useCountryChart(date);
  return <CountryChartView countries={countries ?? []} />;
}
