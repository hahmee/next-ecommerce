// src/entities/analytics/ui/HeatmapChart.tsx

'use client';

import type { ApexOptions } from 'apexcharts';
import React, { useEffect, useState } from 'react';

import ReactApexChart from '@/shared/ui/ReactApexChart';

// 임의로 1년치 주차별 가입자 수를 생성하는 함수 (예시)
function generateHeatmapData(): Array<{
  name: string;
  data: { x: string; y: number }[];
}> {
  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const totalWeeks = 52;

  return daysOfWeek.map((day) => {
    const dayData = [];
    for (let week = 1; week <= totalWeeks; week++) {
      // 무작위 가입자 수 (0 ~ 10 사이)
      const randomValue = Math.floor(Math.random() * 11);
      dayData.push({
        x: `Week ${week}`,
        y: randomValue,
      });
    }
    return {
      name: day,
      data: dayData,
    };
  });
}

export default function HeatmapChart() {
  const [series, setSeries] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // 실제로는 백엔드에서 가입자 데이터를 받아와야 합니다.
    // 여기서는 예시로 무작위 데이터 생성
    const data = generateHeatmapData();
    setSeries(data);
  }, []);

  if (!mounted) {
    // 클라이언트 마운트 전에는 null 반환 (SSR window 에러 방지)
    return null;
  }

  const options: ApexOptions = {
    chart: {
      type: 'heatmap',
      toolbar: { show: false },
    },
    plotOptions: {
      heatmap: {
        shadeIntensity: 0.5,
        // 색상 범위에 따라 색을 변경할 수도 있음
        colorScale: {
          ranges: [
            { from: 0, to: 0, color: '#f5f5f5' }, // 가입자 0명
            { from: 1, to: 3, color: '#c3e6cb' },
            { from: 4, to: 6, color: '#8fd3a7' },
            { from: 7, to: 10, color: '#62c375' }, // 가입자 7~10명
          ],
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      // "Week 1" ~ "Week 52"
      labels: {
        rotate: -45,
      },
    },
    yaxis: {
      // "Sun" ~ "Sat"
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} signups`,
      },
    },
    legend: {
      show: true,
    },
  };

  return (
    <div className="rounded-sm px-5 pb-5 pt-7.5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      {/* <h2 className="text-xl font-bold mb-4">Weekly Signups Heatmap</h2> */}
      <ReactApexChart options={options} series={series} type="heatmap" height={350} />
    </div>
  );
}
