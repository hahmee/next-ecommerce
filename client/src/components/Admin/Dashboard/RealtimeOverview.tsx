'use client';

import { useRealtimeOverview } from '@/hooks/useRealtimeOverview';
import { RealtimeOverviewView } from './RealtimeOverviewView';

export default function RealtimeOverview() {
  const realtimeOverview = useRealtimeOverview();
  return <RealtimeOverviewView {...realtimeOverview} />;
}
