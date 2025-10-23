// src/widgets/admin/dashboard-realtime/ui/RealtimeBottomOverview.tsx

// src/widgets/admin/dashboard-realtime/ui/RealtimeBottomOverview.tsx

'use client';

import dynamic from 'next/dynamic';

import { useRealtimeBottomOverview } from '@/features/dashboard/model/useRealtimeBottomOverview';
import LoadingSkeleton from '@/shared/ui/skeletons/LoadingSkeleton';
const RealtimeBottomOverviewView = dynamic(
  () => import('@/entities/analytics/ui/RealtimeBottomOverviewView'),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  },
);

export default function RealtimeBottomOverview() {
  const { gaBottomData, loading } = useRealtimeBottomOverview();
  if (loading) return <LoadingSkeleton />;

  return <RealtimeBottomOverviewView gaBottomData={gaBottomData} />;
}
