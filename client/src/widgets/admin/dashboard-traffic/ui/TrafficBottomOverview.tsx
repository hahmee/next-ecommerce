// src/widgets/admin/dashboard-traffic/ui/TrafficBottomOverview.tsx

﻿// src/widgets/admin/dashboard-traffic/ui/TrafficBottomOverview.tsx

'use client';

import React from 'react';

import { ChartFilter } from '@/entities/analytics/consts/ChartFilter';
import { TrafficBottomOverviewView } from '@/entities/analytics/ui/TrafficBottomOverviewView';
import { useTrafficBottom } from '@/features/dashboard/model/useTrafficBottom';
import type { DatepickType } from '@/shared/model/DatepickType';
import LoadingSkeleton from '@/shared/ui/skeletons/LoadingSkeleton';

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
