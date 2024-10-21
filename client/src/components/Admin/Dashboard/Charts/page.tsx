"use client";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React from "react";
import ChartOne from "@/components/Admin/Dashboard/Charts/ChartOne";
import ChartTwo from "@/components/Admin/Dashboard/Charts/ChartTwo";
import SalesPieChart from "@/components/Admin/Dashboard/Charts/SalesPieChart";


const Chart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <SalesPieChart />
      </div>
    </>
  );
};

export default Chart;
