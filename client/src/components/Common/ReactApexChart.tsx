"use client";

import dynamic from "next/dynamic";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
  loading: () => <div style={{ height: 20 }}>차트 로딩중...</div>,
});

export default ReactApexChart;