'use client';

import { useRealtimeOverview } from '@/hooks/admin/dashboard/useRealtimeOverview';

import { RealtimeOverviewView } from './RealtimeOverviewView';

export default function RealtimeOverview() {
  const realtimeOverview = useRealtimeOverview();
  return <RealtimeOverviewView {...realtimeOverview} />;
}
