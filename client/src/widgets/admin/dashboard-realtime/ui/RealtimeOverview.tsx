'use client';

import { useRealtimeOverview } from '@/features/dashboard/model/useRealtimeOverview';

import { RealtimeOverviewView } from './RealtimeOverviewView';

export default function RealtimeOverview() {
  const realtimeOverview = useRealtimeOverview();
  return <RealtimeOverviewView {...realtimeOverview} />;
}
