// src/entities/analytics/ui/TestChart.tsx

﻿// src/entities/analytics/ui/TestChart.tsx

'use client';

import type { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';

import ReactApexChart from '@/shared/ui/ReactApexChart';

const TestChart = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 컴포넌트가 클라이언트에 마운트된 후 mounted를 true로 변경
    setMounted(true);
  }, []);

  if (!mounted) {
    // 클라이언트 마운트 전에는 null을 반환하여 window 참조 방지
    return null;
  }

  const lineChartOptions: ApexOptions = {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: 'smooth',
      width: 3,
    },
    markers: {
      size: 5,
    },
    xaxis: {
      categories: [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ],
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '12px',
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: '#9ca3af',
          fontSize: '12px',
        },
      },
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 4,
    },
    tooltip: {
      theme: 'light',
      x: {
        show: true,
      },
    },
    colors: ['#3c50e0'],
  };

  const lineChartSeries = [
    {
      name: '사용자 성장',
      data: [1000, 1500, 1800, 2100, 2400, 2700, 3000, 3200, 3400, 3600, 3800, 4000],
    },
  ];

  return (
    <div className="rounded-sm px-5 pb-5 pt-7.5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <ReactApexChart
        options={lineChartOptions}
        series={lineChartSeries}
        type="line"
        height={350}
      />
    </div>
  );
};

export default TestChart;
