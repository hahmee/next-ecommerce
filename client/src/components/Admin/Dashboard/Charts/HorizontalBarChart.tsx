import React from 'react';
import type { ApexOptions } from 'apexcharts';
import ReactApexChart from '@/components/Common/ReactApexChart';

const HorizontalBarChart = ({ percentage, count }: { percentage: number; count: number }) => {
  const options: ApexOptions = {
    chart: {
      type: 'bar',
      stacked: true,
      sparkline: { enabled: true },
      fontFamily: 'Satoshi, sans-serif',
    },
    colors: ['#3c50e0'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '100%',
        distributed: false,
        borderRadius: 4,
        colors: {
          backgroundBarColors: ['#eeeeee'], // 채워지지 않은 부분의 배경색 지정
          backgroundBarOpacity: 0.5, // 불투명도 (0 ~ 1)
        },
      },
    },
    grid: {
      show: false,
    },
    tooltip: {
      enabled: true, // tooltip 활성화
      theme: 'light', // 원하는 테마 (light 또는 dark)
      x: {
        show: false, // x축 정보는 표시하지 않음
      },
      y: {
        formatter: (val: number) => `${count}`,
        title: {
          formatter: (seriesName: string) => 'Sessions',
        },
      },
    },
    xaxis: {
      max: 100,
      labels: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
  };

  const series = [
    {
      name: 'Percentage',
      data: [percentage],
    },
  ];

  return (
    <div>
      <ReactApexChart options={options} series={series} type="bar" height={20} />
      <div className="my-2 text-xs text-black font-bold text-right">{percentage.toFixed(0)}%</div>
    </div>
  );
};

export default HorizontalBarChart;
