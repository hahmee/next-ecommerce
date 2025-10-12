// src/components/Admin/Dashboard/TrafficMiddleOverview/index.tsx
'use client';

import React from 'react';

import LoadingSkeleton from '@/entities/common/ui/Skeletons/LoadingSkeleton';
import { useTrafficMiddle } from '@/features/dashboard/model/useTrafficMiddle';
import { ChartFilter } from '@/entities/analytics/model/chartFilter';
import type { DatepickType } from '@/entities/common/model/DatepickType';

import { TrafficMiddleOverviewView } from './TrafficMiddleOverviewView';

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
