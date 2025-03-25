import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface SemiCircleChartProps {
  percentage: number;
  title: string;
  label: string;
}

const SemiCircleChart = ({ percentage, title, label }: SemiCircleChartProps) => {
  const series = [percentage];

  const options: ApexOptions = {
    chart: {
      type: 'radialBar',
      offsetY: -20,
      sparkline: { enabled: true },
      fontFamily: "Satoshi, sans-serif",
    },

    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        hollow: {
          size: '70%',
        },
        track: {
          background: "#e7e7e7",
          strokeWidth: '97%',
          margin: 5, // margin in pixels
        },
        dataLabels: {
          name: {
            show: false,
            // offsetY: 50,
            // fontSize: '20px',
          },
          value: {
            offsetY: -2,
            fontSize: '27px',
            fontWeight: 800,
            formatter: function(val: number) {
              return val.toFixed(0) + "%";
            },
          },
        },
      },
    },
    colors: ["#3c50e0"],
    grid: {
      padding: {
        top: -10,
      },
    },

    // 전달받은 label로 설정
    labels: [label],
  };

  return (
      <div className="col-span-2 mb-4 md:mb-6 2xl:mb-7.5 rounded-sm px-5 pb-5 pt-7.5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-1">
        <div className="mb-3 justify-between gap-4 sm:flex">
          <h5 className="text-xl font-semibold text-black dark:text-white">
            {title}
          </h5>
        </div>
        <div className="mb-2">
          <div id="chartThree" className="mx-auto flex justify-center">
            <ReactApexChart options={options} series={series} type="radialBar" height={500}/>
          </div>
          <div>
            사이트 세션이 비교 날짜에 비해 {percentage}% 상승했습니다.
          </div>
        </div>
      </div>
  );
};

export default SemiCircleChart;
