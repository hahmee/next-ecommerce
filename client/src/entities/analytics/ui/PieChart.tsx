// src/entities/analytics/ui/PieChart.tsx

import type { ApexOptions } from 'apexcharts';
import React from 'react';

import { SessionDTO } from '@/entities/analytics/model/GAResponse';
import ReactApexChart from '@/shared/ui/ReactApexChart';

const colors = ['#c3d6f3', '#0FADCF', '#3C50E0', '#6577F3'];

// 랜덤한 색상 선택 함수
const getRandomColor = (length: number) => {
  return colors.slice(0, length);
};

const PieChart = ({
  data,
  title,
  label,
}: {
  data: Array<SessionDTO<number>> | undefined;
  title: string;
  label: string;
}) => {
  const series = data?.map((d) => Number(d.value)) || [];
  const labels = data?.map((d) => (d.key === '' ? 'Unknown' : d.key)) || [];

  const colors = getRandomColor(data?.length || 0);

  const options: ApexOptions = {
    chart: {
      fontFamily: 'Satoshi, sans-serif',
      type: 'donut',
    },
    colors, // ["#3C50E0", "#6577F3", "#8FD0EF", "#0FADCF"],
    labels, // ["Desktop", "Tablet", "Mobile", "Unknown"],
    legend: {
      show: false,
      position: 'bottom',
    },
    plotOptions: {
      pie: {
        customScale: 0.7,
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              label,
              formatter(w) {
                // Total 값을 toLocaleString()으로 포맷
                const totalValue = w.globals.seriesTotals.reduce(
                  (a: number, b: number) => a + b,
                  0,
                );
                return totalValue.toLocaleString();
              },
            },
          },
          size: '80%', // 두깨
          background: 'transparent',
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 380,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: 200,
          },
        },
      },
    ],
  };

  return (
    <div className="h-full rounded-sm px-5 pb-5 pt-7.5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-3 justify-between gap-4 sm:flex">
        <h5 className="text-xl font-semibold text-black dark:text-white">{title}</h5>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {data?.map((d, index) => {
          return (
            <div className="w-full px-8 sm:w-1/2" key={d.key}>
              <div className="flex w-full items-center">
                <span
                  className="mr-2 block h-3 w-full max-w-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                  <span> {d.key || 'Unknown'} </span>
                  <span> {d.value.toLocaleString() || 0} </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PieChart;
