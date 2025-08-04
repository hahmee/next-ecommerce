"use server";

import SalesOverview from "@/components/Admin/Dashboard/SalesOverview";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {ChartFilter} from "@/types/chartFilter";
import {ChartContext} from "@/types/chartContext";
import {getSalesCards, getSalesCharts} from "@/apis/dashbaordAPI";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
import dayjs from "dayjs";

export default async function DashBoardSalesPage() {

  const today = dayjs(); // 오늘 날짜
  const startDate = today.subtract(4, "month"); // 4개월 전

  const comparedEndDate = startDate.subtract(1, "day"); // startDate 하루 전
  const comparedStartDate = comparedEndDate.subtract(4, "month"); // 또 4개월 전

  const date = {
    startDate: startDate.format("YYYY-MM-DD"),
    endDate: today.format("YYYY-MM-DD"),
  };

  const prefetchOptions = [
    {
      queryKey: ['salesCards', ChartFilter.DAY, date, ChartContext.TOPSALES],
      queryFn: () => getSalesCards({
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: today.format("YYYY-MM-DD"),
        filter: ChartFilter.DAY,
        comparedStartDate: comparedStartDate.format("YYYY-MM-DD"),
        comparedEndDate: comparedEndDate.format("YYYY-MM-DD"),
        context: ChartContext.TOPSALES,
      }),
    },
    {
      queryKey: ['salesCharts', ChartFilter.DAY, date, ChartContext.TOPSALES],
      queryFn: () => getSalesCharts({
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: today.format("YYYY-MM-DD"),
        filter: ChartFilter.DAY,
        comparedStartDate: comparedStartDate.format("YYYY-MM-DD"),
        comparedEndDate: comparedEndDate.format("YYYY-MM-DD"),
        context: ChartContext.TOPSALES,
      }),
    },
  ]

  return <div className="mx-auto">
    <Breadcrumb pageName="Sales Overview"/>
    <div className="flex flex-col gap-5">
      <Suspense fallback={<DashboardSkeleton/>}>
        <PrefetchBoundary prefetchOptions={prefetchOptions}>
          <ErrorHandlingWrapper>
            <SalesOverview/>
          </ErrorHandlingWrapper>
        </PrefetchBoundary>
      </Suspense>
    </div>
  </div>;
}