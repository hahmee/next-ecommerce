'use client';

import type { DatepickType } from '@/shared/model/DatepickType';
import LoadingSkeleton from '@/shared/ui/skeletons/LoadingSkeleton';

export function TrafficMiddleOverview({
  date,
  comparedDate,
}: {
  date: DatepickType;
  comparedDate: DatepickType;
}) {
  const { data, isLoading, isFetching } = useTrafficMiddle(date, comparedDate, ChartFilter.DAY);

  if (isLoading || isFetching) return <LoadingSkeleton />;

  return <TrafficMiddleOverviewView data={data} />;
}
