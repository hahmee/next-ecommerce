'use client';

import { useSalesOverview } from '@/features/dashboard/model/useSalesOverview';
import { SalesOverviewView } from '@/widgets/admin/dashboard-sales/ui/SalesOverviewView';

export default function SalesOverview({ initialToday }: { initialToday: string }) {
  const salesOverview = useSalesOverview({ initialToday });
  return <SalesOverviewView {...salesOverview} />;
}
