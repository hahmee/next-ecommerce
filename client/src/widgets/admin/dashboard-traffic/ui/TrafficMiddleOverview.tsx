// src/widgets/admin/dashboard-traffic/ui/TrafficMiddleOverview.tsx

﻿// src/widgets/admin/dashboard-traffic/ui/TrafficMiddleOverview.tsx

'use client';

import React from 'react';

import { ChartFilter } from '@/entities/analytics/consts/ChartFilter';
import { TrafficMiddleOverviewView } from '@/entities/analytics/ui/TrafficMiddleOverviewView';
import { useTrafficMiddle } from '@/features/dashboard/model/useTrafficMiddle';
import type { DatepickType } from '@/shared/model/DatepickType';
import LoadingSkeleton from '@/shared/ui/skeletons/LoadingSkeleton';

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
