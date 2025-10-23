'use client';
import dynamic from 'next/dynamic';
import React from 'react';

import type { MapResponse } from '@/entities/analytics';
import LazyLoadWrapper from '@/shared/ui/LazyLoadWrapper';

const SalesPieChart = dynamic(() => import('@/entities/analytics').then((mod) => mod.SalesPieChartView), {
  ssr: false,
});
const CountryMap = dynamic(() => import('@/entities/analytics').then((mod) => mod.CountryMapView), { ssr: false });

export function CountryChartView({ countries }: { countries: MapResponse[] }) {
  return (
    <>
      <div className="col-span-12 rounded-sm border border-stroke bg-white px-7.5 py-6 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-8">
        <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
          <CountryMap countries={countries} />
        </LazyLoadWrapper>
      </div>

      <div className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:col-span-4">
        <LazyLoadWrapper fallback={<div>Loading...</div>} className="min-h-[400px]">
          <SalesPieChart countries={countries} />
        </LazyLoadWrapper>
      </div>
    </>
  );
}
