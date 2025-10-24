import type { ApexOptions } from 'apexcharts';
import React from 'react';

import { SessionChart } from '@/entities/analytics';
import ReactApexChart from '@/shared/ui/ReactApexChart';

export const ActiveVisitChartView = ({ chart }: { chart: SessionChart | undefined | null }) => {
  const options: ApexOptions = {
    series: [
      {
        data: chart?.data || [],
      },
    ],
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      height: 150,
      type: 'bar',
      dropShadow: {
        enabled: false,
        color: 'red',
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 320,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 280,
          },
        },
      },
    ],

    colors: ['#3c50e0'],
    grid: {
      show: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '12px',
        distributed: false,
        borderRadius: 4,
      },
    },
    stroke: {
      show: false,
      width: 0,
      colors: ['transparent'],
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    xaxis: {
      categories: chart?.xaxis,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
      },
      labels: {
        show: true,
        style: {
          colors: '#8c8c8c',
        },
        // 0인 값 제외하고 xaxis 값만 표시
        formatter(value) {
          if (value && Number(value) % 5 === 0) {
            return `-${value}분`; // 5의 배수라면 표시
          }
          return '';
        },
      },
    },
    yaxis: {
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        show: true,
        style: {
          colors: '#8c8c8c',
        },
      },
    },
  };

  return (
    <div className="h-full col-span-2 mb-4 md:mb-6 2xl:mb-7.5 rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-1">
      <p className="text-xs px-4.5 pt-4.5 font-semibold text-gray-600 dark:text-white">
        분당 활성 사용자
      </p>

      <div id="chartOne" className="">
        {chart && (
          <ReactApexChart
            options={options}
            series={options.series}
            type={options.chart?.type}
            height={150}
            width="100%"
          />
        )}
      </div>
    </div>
  );
};
