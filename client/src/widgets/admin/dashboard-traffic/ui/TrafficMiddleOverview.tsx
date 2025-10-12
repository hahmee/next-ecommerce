// src/components/Admin/Dashboard/TrafficMiddleOverview/index.tsx
'use client';

import React from 'react';

import LoadingSkeleton from '@/components/Skeleton/LoadingSkeleton';
import { useTrafficMiddle } from '@/hooks/admin/dashboard/useTrafficMiddle';
import { ChartFilter } from '@/types/chartFilter';
import type { DatepickType } from '@/types/DatepickType';

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
