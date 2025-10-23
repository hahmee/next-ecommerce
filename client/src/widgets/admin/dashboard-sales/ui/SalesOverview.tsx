'use client';

import { useSalesOverview } from '@/features/dashboard';
import { SalesOverviewView } from '@/widgets/admin/dashboard-sales/ui/SalesOverviewView';

export function SalesOverview({ initialToday }: { initialToday: string }) {
  const salesOverview = useSalesOverview({ initialToday });
  return <SalesOverviewView {...salesOverview} />;
}
