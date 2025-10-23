'use client';

import dynamic from 'next/dynamic';

import { useRealtimeBottomOverview } from '@/features/dashboard';
import LoadingSkeleton from '@/shared/ui/skeletons/LoadingSkeleton';
const RealtimeBottomOverviewView = dynamic(
  () => import('@/entities/analytics').then((mod) => mod.RealtimeBottomOverviewView),
  {
    ssr: false,
    loading: () => <LoadingSkeleton />,
  },
);

export function RealtimeBottomOverview() {
  const { gaBottomData, loading } = useRealtimeBottomOverview();
  if (loading) return <LoadingSkeleton />;

  return <RealtimeBottomOverviewView gaBottomData={gaBottomData} />;
}
