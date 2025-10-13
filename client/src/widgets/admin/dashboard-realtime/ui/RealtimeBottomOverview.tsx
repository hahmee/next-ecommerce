'use client';

import dynamic from 'next/dynamic';

import LoadingSkeleton from '@/shared/ui/skeletons/LoadingSkeleton';
import { useRealtimeBottomOverview } from '@/features/dashboard/model/useRealtimeBottomOverview';
const RealtimeBottomOverviewView = dynamic(() => import('@/entities/analytics/ui/RealtimeBottomOverviewView'), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

export default function RealtimeBottomOverview() {
  const { gaBottomData, loading } = useRealtimeBottomOverview();
  if (loading) return <LoadingSkeleton />;

  return <RealtimeBottomOverviewView gaBottomData={gaBottomData} />;
}
