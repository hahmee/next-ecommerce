'use client';

import React from 'react';

import { ChartFilter } from '@/entities/analytics/model/chartFilter';
import {TrafficBottomOverviewView} from "@/entities/analytics/ui/TrafficBottomOverviewView";
import type { DatepickType } from '@/entities/common/model/DatepickType';
import LoadingSkeleton from '@/entities/common/ui/Skeletons/LoadingSkeleton';
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
