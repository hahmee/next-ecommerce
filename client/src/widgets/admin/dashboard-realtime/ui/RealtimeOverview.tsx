'use client';

import { RealtimeOverviewView } from '@/entities/analytics/ui';
import { useRealtimeOverview } from '@/features/dashboard';

export function RealtimeOverview() {
  const realtimeOverview = useRealtimeOverview();
  return <RealtimeOverviewView {...realtimeOverview} />;
}
