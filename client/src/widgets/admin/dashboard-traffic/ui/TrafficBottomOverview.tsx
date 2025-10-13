'use client';

import React from 'react';

import { ChartFilter } from '@/entities/analytics/model/chartFilter';
import {TrafficBottomOverviewView} from "@/entities/analytics/ui/TrafficBottomOverviewView";
import type { DatepickType } from '@/shared/model/DatepickType';
import LoadingSkeleton from '@/shared/ui/skeletons/LoadingSkeleton';
import { useTrafficBottom } from '@/features/dashboard/model/useTrafficBottom';

export default function TrafficBottomOverview({
  date,
  comparedDate,
}: {
  date: DatepickType;
  comparedDate: DatepickType;
}) {
  const { data, isLoading, isFetching } = useTrafficBottom(date, comparedDate, ChartFilter.DAY);

  if (isLoading || isFetching) return <LoadingSkeleton />;

  return <TrafficBottomOverviewView data={data} />;
}
