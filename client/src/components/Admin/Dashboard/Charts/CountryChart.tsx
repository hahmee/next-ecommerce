'use client';
import React from 'react';
import type { DatepickType } from '@/types/DatepickType';
import {useCountryChart} from "@/hooks/useCountryChart";
import {CountryChartView} from "@/components/Admin/Dashboard/Charts/CountryChartView";

export default function CountryChart({ date }: { date: DatepickType }) {
  const { data: countries } = useCountryChart(date);
  return <CountryChartView countries={countries ?? []} />;
}
