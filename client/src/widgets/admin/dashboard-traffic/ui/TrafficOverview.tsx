'use client';

import React from 'react';

import { TrafficOverviewView } from '@/entities/analytics/ui/TrafficOverviewView';
import { useTrafficOverview } from '@/features/dashboard/model/useTrafficOverview';

export default function TrafficOverview({ initialToday }: { initialToday: string }) {
  const trafficOverview = useTrafficOverview(initialToday);

  return (
    <TrafficOverviewView
      date={trafficOverview.date}
      comparedDate={trafficOverview.comparedDate}
      maxDate={trafficOverview.maxDate}
      filter={trafficOverview.filter}
      gaTopData={trafficOverview.gaTopData}
      percentages={trafficOverview.percentages}
      onDateChange={trafficOverview.dateChange}
      onFilterChange={trafficOverview.filterChange}
    />
  );
}
