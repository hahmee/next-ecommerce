// src/widgets/admin/dashboard-realtime/ui/RealtimeOverview.tsx

﻿// src/widgets/admin/dashboard-realtime/ui/RealtimeOverview.tsx



'use client';

import { RealtimeOverviewView } from '@/entities/analytics/ui/RealtimeOverviewView';
import { useRealtimeOverview } from '@/features/dashboard/model/useRealtimeOverview';

export default function RealtimeOverview() {
  const realtimeOverview = useRealtimeOverview();
  return <RealtimeOverviewView {...realtimeOverview} />;
}
