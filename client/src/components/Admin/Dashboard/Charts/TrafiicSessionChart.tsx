"use client";

import {ApexOptions} from "apexcharts";
import React from "react";
import dynamic from "next/dynamic";
import {SessionChart} from "@/interface/GAResponse";
import {ChartFilter} from "@/types/chartFilter";


const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const TrafficSessionChart = ({chart ,filter, filterChange}: { chart: SessionChart | undefined | null, filter: ChartFilter, filterChange: (filter:ChartFilter) => void }) => {

  const options: ApexOptions = {
    series: [{
      // data:  [21, 22, 10, 28, 16, 21, 13, 30]
      data: chart?.data || [],
    }],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 350,
      type: 'bar',
      dropShadow: {
        enabled: false,
        color: "red",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: false,
      },

      // events: {
      //   click: function(chart, w, e) {
      //     // console.log(chart, w, e)
      //   }
      // }
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

    colors: ["#3c50e0"],
    grid: {
      show:false,
    },
    plotOptions: {
      bar: {
        columnWidth: '23px',
        distributed: false,
        borderRadius: 4,
      }
    },
    stroke: {
      show: false,
      width: 0,
      colors: ['transparent'],
    },
    dataLabels: {
      enabled: false
    },
    legend: {
      show: true,
      position: "bottom",
      horizontalAlign: "center",
    },
    xaxis: {
      categories: chart?.xaxis,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
      labels: {
        show: true,
          style: {
            colors: "#8c8c8c",
          }
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
          colors: "#8c8c8c",
        }
      },
    },
  };


  return (
      <div className="col-span-12 mb-4 md:mb-6 2xl:mb-7.5 rounded-sm border border-stroke bg-white px-5 pb-5 pt-7.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5">
        <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
          <div className="flex w-full flex-wrap gap-3 sm:gap-5">
            <div className="flex min-w-47.5">
              <div className="w-full flex">
                <p className="text-xl font-semibold text-black dark:text-white">Sessions over time</p>
              </div>
            </div>

          </div>

          <div className="flex w-full max-w-45 justify-end">
            <div className="inline-flex items-center rounded-md bg-whiter p-1.5 dark:bg-meta-4">
              <button
                  onClick={() => filterChange(ChartFilter.DAY)}
                  className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark ${filter === ChartFilter.DAY ? "bg-white shadow-card" : ""}`}>
                Day
              </button>
              <button
                  onClick={() => filterChange(ChartFilter.WEEK)}
                  className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark ${filter === ChartFilter.WEEK ? "bg-white shadow-card" : ""}`}>
                Week
              </button>
              <button
                  onClick={() => filterChange(ChartFilter.MONTH)}
                  className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark ${filter === ChartFilter.MONTH ? "bg-white shadow-card" : ""}`}>
                Month
              </button>
              <button
                  onClick={() => filterChange(ChartFilter.YEAR)}
                  className={`rounded px-3 py-1 text-xs font-medium text-black hover:bg-white hover:shadow-card dark:bg-boxdark dark:text-white dark:hover:bg-boxdark ${filter === ChartFilter.YEAR ? "bg-white shadow-card" : ""}`}>
                Year
              </button>
            </div>
          </div>

        </div>

        <div>
          <div id="chartOne" className="-ml-5">
            {
              chart &&  <ReactApexChart
                    options={options}
                    series={options.series}
                    type={options.chart?.type}
                    height={350}
                    width={"100%"}
                />
            }

          </div>
        </div>
      </div>
  );
};

export default TrafficSessionChart;
