'use client';

import React from 'react';
import type { DatepickType } from '@/types/DatepickType';
import { ChartFilter } from '@/types/chartFilter';
import LoadingSkeleton from '@/components/Skeleton/LoadingSkeleton';
import { useTrafficBottom } from '@/hooks/useTrafficBottom';
import {TrafficBottomOverviewView} from "@/components/Admin/Dashboard/TrafficBottomOverviewView";

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
