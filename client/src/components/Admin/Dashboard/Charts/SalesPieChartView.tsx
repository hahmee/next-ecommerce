import type { ApexOptions } from 'apexcharts';
import React from 'react';

import ReactApexChart from '@/components/Common/ReactApexChart';
import { MapResponse } from '@/interface/MapResponse';

const colors = ['#3C50E0', '#6577F3', '#8FD0EF', '#0FADCF'];

// 랜덤한 색상 선택 함수
const getRandomColor = () => {
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
};

const SalesPieChartView = ({ countries }: { countries: Array<MapResponse> | undefined }) => {
  const series = countries?.map((c) => (c.totalSales === null ? 0 : c.totalSales)) || [];
  const labels = countries?.map((c) => (c.country === null ? '' : c.country)) || [];

  const colors = series.map(() => getRandomColor());

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
        customScale: 0.9,
        donut: {
          labels: {
            show: true,
            total: {
              showAlways: true,
              show: true,
              label: 'Total',
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
          size: '70%', // 두깨
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
    <>
      <div className="mb-3 justify-between gap-4 sm:flex">
        <h5 className="text-xl font-semibold text-black dark:text-white">Country Analytics</h5>
      </div>

      <div className="mb-2">
        <div id="chartThree" className="mx-auto flex justify-center">
          <ReactApexChart options={options} series={series} type="donut" />
        </div>
      </div>

      <div className="-mx-8 flex flex-wrap items-center justify-center gap-y-3">
        {countries?.map((country, index) => {
          return (
            <div className="w-full px-8 sm:w-1/2" key={country.country}>
              <div className="flex w-full items-center">
                <span
                  className="mr-2 block h-3 w-full max-w-3 rounded-full"
                  style={{ backgroundColor: colors[index] }}
                />
                <p className="flex w-full justify-between text-sm font-medium text-black dark:text-white">
                  <span> {country.country || 'Unknown'} </span>
                  <span> {country.totalSales.toLocaleString() || 0} </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default SalesPieChartView;
