'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import type { GAResponseBottom } from '@/entities/analytics/model/GAResponse';
import LoadingSkeleton from '@/entities/common/ui/Skeletons/LoadingSkeleton';
import LazyLoadWrapper from '@/widgets/common/ui/LazyLoadWrapper';

const CountryTrafficMap = dynamic(() => import('@/entities/analytics/ui/CountryTrafficMapView'), { ssr: false });

export function TrafficBottomOverviewView({ data }: { data?: GAResponseBottom }) {
  if (!data) return <LoadingSkeleton />;

  return (
    <div className="col-span-12">
      <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
        <CountryTrafficMap countries={data.countries} />
      </LazyLoadWrapper>
    </div>
  );
}
