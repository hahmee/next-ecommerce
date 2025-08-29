'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { ChartFilter } from '@/types/chartFilter';
import { getGoogleAnalyticsBottom } from '@/apis/dashbaordAPI';
import { GAResponseBottom } from '@/interface/GAResponse';
import { useQuery } from '@tanstack/react-query';
import LazyLoadWrapper from '@/components/Common/LazyLoadWrapper';
import LoadingSkeleton from '@/components/Skeleton/LoadingSkeleton';
import { DatepickType } from '@/types/DatepickType';

type Props = {
  date: DatepickType;
  comparedDate: DatepickType;
};

const CountryTrafficMap = dynamic(
  () => {
    return import('./Maps/CountryTrafficMap');
  },
  { ssr: false },
);

const TrafficBottomOverview: React.FC<Props> = ({ date, comparedDate }) => {
  const {
    data: gaBottomData,
    isLoading,
    isFetching,
  } = useQuery<GAResponseBottom, Object, GAResponseBottom>({
    queryKey: ['gaBottom', date],
    queryFn: () =>
      getGoogleAnalyticsBottom({
        startDate: date.startDate,
        endDate: date.endDate,
        filter: ChartFilter.DAY, // 어차피 필요없으니 기본 값으로 둔다
        comparedStartDate: comparedDate.startDate,
        comparedEndDate: comparedDate.endDate,
      }),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: true,
    enabled:
      !!date.startDate && !!date.endDate && !!comparedDate.startDate && !!comparedDate.endDate,
  });

  if (isLoading || isFetching) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="col-span-12">
      <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
        <CountryTrafficMap countries={gaBottomData?.countries} />
      </LazyLoadWrapper>
    </div>
  );
};

export default React.memo(TrafficBottomOverview);
