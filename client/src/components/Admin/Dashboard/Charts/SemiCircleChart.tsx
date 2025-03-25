import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface MultiRadialChartProps {
  percentages: number[]; // 예: [67, 84, 97]
  title: string;
  labels: string[];      // 예: ['Apples', 'Oranges', 'Bananas']
  total: string;
}

const SemiCircleChart = ({ percentages, title, labels, total }: MultiRadialChartProps) => {
  const series = percentages;
  const options: ApexOptions = {
    series: series,
    chart: {
      type: 'radialBar',
      sparkline: { enabled: true },
      fontFamily: "Satoshi, sans-serif",
    },
    plotOptions: {
      radialBar: {
        offsetY: 0,
        startAngle: 0,
        endAngle: 360,
        hollow: {
          margin: 10,
          size: '50%', // hollow 영역의 크기를 줄이면, 진행바 두께가 늘어남
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
            // formatter: function(val: number) {
            //   return `${val.toFixed(0)}%`;
            // },
          },
          // total 옵션은 전체 합계를 표시할 때 사용
          total: {
            show: true,
            label: 'Sessions',
            fontWeight:800,
            formatter: function (w) {
              return total;
            }
          }
        },
      },
    },
    colors: ["#3c50e0", "#8FD0EF", "#0FADCF"],
    grid: {
      padding: {
        top: 0,
      },
    },
    labels: labels,
  };

  return (
      <div className="col-span-2 mb-4 md:mb-6 2xl:mb-7.5 rounded-sm px-5 pb-5 pt-7.5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-1">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <h5 className="text-xl font-semibold text-black dark:text-white">
            {title}
          </h5>
        </div>
        <div className="mb-2">
          <div id="chartMultiple" className="mx-auto flex justify-center">
            <ReactApexChart options={options} series={series} type="radialBar" height={350} />
          </div>
        </div>
      </div>
  );
};

export default SemiCircleChart;
