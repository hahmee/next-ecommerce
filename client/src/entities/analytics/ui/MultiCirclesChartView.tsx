import { ArrowDownIcon, ArrowUpIcon } from '@heroicons/react/20/solid';
import type { ApexOptions } from 'apexcharts';
import React, { useMemo } from 'react';

import ReactApexChart from '@/shared/ui/ReactApexChart';

interface MultiRadialChartProps {
  percentages: number[];
  title: string;
  labels: string[];
  total: string;
}

const MultiCirclesChartViewComponent = ({
  percentages,
  title,
  labels,
  total,
}: MultiRadialChartProps) => {
  const series = percentages;
  const options: ApexOptions = useMemo(
    () => ({
      series,
      chart: {
        type: 'radialBar',
        sparkline: { enabled: true },
        fontFamily: 'Satoshi, sans-serif',
      },
      plotOptions: {
        radialBar: {
          offsetY: 0,
          startAngle: 0,
          endAngle: 360,
          hollow: {
            margin: 10,
            size: '50%',
            background: 'transparent',
          },
          dataLabels: {
            name: {
              show: true,
              fontSize: '16px',
            },
            value: {
              fontSize: '22px',
              fontWeight: 800,
            },
            total: {
              show: true,
              label: 'Sessions',
              fontWeight: 800,
              formatter() {
                return total;
              },
            },
          },
        },
      },
      colors: ['#3c50e0', '#8FD0EF', '#0FADCF'],
      grid: {
        padding: {
          top: 0,
        },
      },
      labels,
    }),
    [series, labels, total],
  );

  return (
    <div className="h-full col-span-2 rounded-sm px-5 pt-7.5 pb-5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-1 flex flex-col">
      {/* 상단 제목 */}
      <div className="mb-3 sm:flex justify-between gap-4">
        <h5 className="text-xl font-semibold text-black dark:text-white">{title}</h5>
      </div>

      {/* 차트 영역 - flex-grow로 공간을 채움 */}
      <div id="chartMultiple" className="mx-auto flex justify-center flex-grow">
        <ReactApexChart options={options} series={series} type="radialBar" height={350} />
      </div>

      {/* 하단 영역 - mt-auto로 하단에 고정 */}
      <div className="mt-auto flex bg-gray-50 p-4 rounded-lg shadow-sm divide-x divide-gray-200">
        {labels.map((label, index) => (
          <div key={index} className="flex flex-col items-center justify-center flex-1 py-2">
            <span className="text-sm text-gray-600 text-center">{label}</span>
            <div className="flex items-center space-x-1 font-semibold text-lg">
              <span>{percentages[index]}%</span>
              {percentages[index] >= 0 ? (
                <ArrowUpIcon className="w-5 h-5 text-green-500" />
              ) : (
                <ArrowDownIcon className="w-5 h-5 text-red-700" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const MultiCirclesChartView = React.memo(MultiCirclesChartViewComponent);
