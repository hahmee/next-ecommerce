import React from "react";
import { ApexOptions } from "apexcharts";
import {ArrowUpIcon} from "@heroicons/react/20/solid";
import {ArrowDownIcon} from "@heroicons/react/20/solid";
import ReactApexChart from "@/components/Common/ReactApexChart";

interface MultiRadialChartProps {
  percentages: number[];
  title: string;
  labels: string[];
  total: string;
}

const MultiCirclesChart = ({ percentages, title, labels, total }: MultiRadialChartProps) => {
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
      <div className="h-full col-span-2 rounded-sm px-5 pt-7.5 pb-5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-1 flex flex-col">
        {/* 상단 제목 */}
        <div className="mb-3 sm:flex justify-between gap-4">
          <h5 className="text-xl font-semibold text-black dark:text-white">
            {title}
          </h5>
        </div>

        {/* 차트 영역 - flex-grow로 공간을 채움 */}
        <div id="chartMultiple" className="mx-auto flex justify-center flex-grow">
          <ReactApexChart options={options} series={series} type="radialBar" height={350}/>
        </div>

        {/* 하단 영역 - mt-auto로 하단에 고정 */}
        <div className="mt-auto flex bg-gray-50 p-4 rounded-lg shadow-sm divide-x divide-gray-200">
          {labels.map((label, index) => (
              <div key={index} className="flex flex-col items-center justify-center flex-1 py-2">
                <span className="text-sm text-gray-600 text-center">{label}</span>
                <div className="flex items-center space-x-1 font-semibold text-lg">
                  <span>{percentages[index]}%</span>
                  {percentages[index] >= 0 ? (
                      <ArrowUpIcon className="w-5 h-5 text-green-500"/>
                  ) : (
                      <ArrowDownIcon className="w-5 h-5 text-red-700"/>
                  )}
                </div>
              </div>
          ))}
        </div>
      </div>
  );
};

export default React.memo(MultiCirclesChart);
