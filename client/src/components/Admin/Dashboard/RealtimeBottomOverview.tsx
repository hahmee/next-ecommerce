'use client';

import dynamic from 'next/dynamic';

import LoadingSkeleton from '@/components/Skeleton/LoadingSkeleton';
import { useRealtimeBottomOverview } from '@/hooks/admin/dashboard/useRealtimeBottomOverview';
const RealtimeBottomOverviewView = dynamic(() => import('./RealtimeBottomOverviewView'), {
  ssr: false,
  loading: () => <LoadingSkeleton />,
});

export default function RealtimeBottomOverview() {
  const { gaBottomData, loading } = useRealtimeBottomOverview();
  if (loading) return <LoadingSkeleton />;

  return <RealtimeBottomOverviewView gaBottomData={gaBottomData} />;
}
