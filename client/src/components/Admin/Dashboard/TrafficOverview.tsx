'use client';

import React from 'react';
import { useTrafficOverview } from '@/hooks/useTrafficOverview';
import {TrafficOverviewView} from "@/components/Admin/Dashboard/TrafficOverviewView";

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
