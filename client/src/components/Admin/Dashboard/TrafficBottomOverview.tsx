'use client';

import React from 'react';

import { TrafficBottomOverviewView } from '@/components/Admin/Dashboard/TrafficBottomOverviewView';
import LoadingSkeleton from '@/components/Skeleton/LoadingSkeleton';
import { useTrafficBottom } from '@/hooks/admin/dashboard/useTrafficBottom';
import { ChartFilter } from '@/types/chartFilter';
import type { DatepickType } from '@/types/DatepickType';

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
