"use client";

import {ApexOptions} from "apexcharts";
import React, {useEffect} from "react";
import dynamic from "next/dynamic";
import {ChartResponse} from "@/interface/ChartResponse";
import {ChartFilter} from "@/types/chartFilter";

const data = {
  "startDate": "2024-10-01", //해당 날짜
  "endDate": "2024-10-15", //해당 날짜
  "totalSales": 12000,   // 전체 매출
  "totalOrders": 74,   // 전체 주문
  "avgOrderSale": 129,  // 평균 주문 값
  // "salesTrend": [ //날짜에 맞춰서 . 근데 그래프니까
  //   { "date": "2024-10-01", "sales": 1500 },
  //   { "date": "2024-10-02", "sales": 2000 },
  //   { "date": "2024-10-03", "sales": 2500 },
  //   { "date": "2024-10-05", "sales": 3000 },
  // ],
  "xaxis": [ //가로축
    "2024-10-01",
    "2024-10-02",
    "2024-10-03",
    "2024-10-04"
  ],
  "series": [
    {
      "name": "Sales One",
      "data": [23, 11, 22, 27],
    },
    {
      "name": "Sales Two",
      "data": [12, 22, 30, 45],
    }
  ],

};

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const SalesChart = ({chart,filter, filterChange}: { chart: ChartResponse, filter:ChartFilter,filterChange: (filter:ChartFilter) => void }) => {

  const series = chart.series;
  const xaxis = chart.xaxis;


  const options: ApexOptions = {
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
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
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    // labels: {
    //   show: false,
    //   position: "top",
    // },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: xaxis, //data.xaxis,
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      // max: 100,
    },
  };

  useEffect(() => {
    console.log('chart...', chart);
    console.log('series', series);

  }, [chart]);

  return (
      <div
          className="col-span-12 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
          <div className="flex w-full flex-wrap gap-3 sm:gap-5">
            <div className="flex min-w-47.5">
              <div className="w-full flex">
                <p className="font-semibold text-secondary">Total Sales</p>
                <p className="font-semibold text-secondary ml-3">{filter}</p>
              </div>
            </div>

          </div>
          <div className="flex w-full max-w-45 justify-end">
            <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
              <button
                  onClick={()=>filterChange(ChartFilter.DAY)}
                  className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark ${ filter === ChartFilter.DAY  ? "bg-white shadow-card": ""}`}>
                Day
              </button>
              <button
                  onClick={()=>filterChange(ChartFilter.WEEK)}
                  className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark ${ filter === ChartFilter.WEEK  ? "bg-white shadow-card": ""}`}>
                Week
              </button>
              <button
                  onClick={()=>filterChange(ChartFilter.MONTH)}
                  className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark ${ filter === ChartFilter.MONTH  ? "bg-white shadow-card": ""}`}>
                Month
              </button>
              <button
                  onClick={()=>filterChange(ChartFilter.YEAR)}
                  className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark ${ filter === ChartFilter.YEAR  ? "bg-white shadow-card": ""}`}>
                Year
              </button>
            </div>
          </div>
        </div>

        <div>
          <div id="chartOne" className="-ml-5">
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={350}
                width={"100%"}
            />
          </div>
        </div>
      </div>
  );
};

export default SalesChart;
