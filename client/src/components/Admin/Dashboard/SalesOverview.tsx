'use client';

import { useSalesOverview } from '@/hooks/useSalesOverview';
import { SalesOverviewView } from './SalesOverviewView';

export default function SalesOverview({ initialToday }: { initialToday: string }) {
  const salesOverview = useSalesOverview({ initialToday });
  return <SalesOverviewView {...salesOverview} />;
}
