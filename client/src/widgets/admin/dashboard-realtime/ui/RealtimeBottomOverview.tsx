'use client';

import dynamic from 'next/dynamic';

import LoadingSkeleton from '@/entities/common/ui/Skeletons/LoadingSkeleton';
import { useRealtimeBottomOverview } from '@/features/dashboard/model/useRealtimeBottomOverview';
const RealtimeBottomOverviewView = dynamic(() => import('./RealtimeBottomOverviewView'), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

export default function RealtimeBottomOverview() {
  const { gaBottomData, loading } = useRealtimeBottomOverview();
  if (loading) return <LoadingSkeleton />;

  return <RealtimeBottomOverviewView gaBottomData={gaBottomData} />;
}
