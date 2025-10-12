'use client';

import React from 'react';

import { TrafficBottomOverviewView } from '@/widgets/admin/dashboard-traffic/ui/TrafficBottomOverviewView';
import LoadingSkeleton from '@/entities/common/ui/Skeletons/LoadingSkeleton';
import { useTrafficBottom } from '@/features/dashboard/model/useTrafficBottom';
import { ChartFilter } from '@/entities/analytics/model/chartFilter';
import type { DatepickType } from '@/entities/common/model/DatepickType';

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
