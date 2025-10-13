'use client';

import React from 'react';

import { ChartFilter } from '@/entities/analytics/model/chartFilter';
import {TrafficMiddleOverviewView} from "@/entities/analytics/ui/TrafficMiddleOverviewView";
import type { DatepickType } from '@/shared/model/DatepickType';
import LoadingSkeleton from '@/shared/ui/skeletons/LoadingSkeleton';
import { useTrafficMiddle } from '@/features/dashboard/model/useTrafficMiddle';


export default function TrafficMiddleOverview({
  date,
  comparedDate,
}: {
  date: DatepickType;
  comparedDate: DatepickType;
}) {
  const { data, isLoading, isFetching } = useTrafficMiddle(date, comparedDate, ChartFilter.DAY);

  if (isLoading || isFetching) return <LoadingSkeleton />;

  return <TrafficMiddleOverviewView data={data} />;
}
