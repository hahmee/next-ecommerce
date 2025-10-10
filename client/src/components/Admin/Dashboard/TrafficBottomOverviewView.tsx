'use client';

import dynamic from 'next/dynamic';
import React from 'react';

import LazyLoadWrapper from '@/components/Common/LazyLoadWrapper';
import LoadingSkeleton from '@/components/Skeleton/LoadingSkeleton';
import type { GAResponseBottom } from '@/interface/GAResponse';

const CountryTrafficMap = dynamic(() => import('./Maps/CountryTrafficMapView'), { ssr: false });

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
