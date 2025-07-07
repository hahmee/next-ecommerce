"use server";

import SalesOverview from "@/components/Admin/Dashboard/SalesOverview";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {ChartFilter} from "@/types/chartFilter";
import {ChartContext} from "@/types/chartContext";
import {getSalesCards, getSalesCharts} from "@/apis/dashbaordAPI";
import formatDate from "@/libs/formatDate";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

export default async function DashBoardSalesPage() {
    const endDate = new Date(); // today
    const startDate = new Date(); // today

    startDate.setMonth(endDate.getMonth() - 4); // 4개월 전

    // 새로운 날짜 계산
    const comparedEndDate = new Date(startDate); // endDate 복사
    comparedEndDate.setDate(startDate.getDate() - 1); // 1일 빼기

    const comparedStartDate = new Date(comparedEndDate); // newEndDate 복사
    comparedStartDate.setMonth(comparedEndDate.getMonth() - 4); // 4개월 전

    const date = {
        startDate: formatDate(startDate), // format as YYYY-MM-DD
        endDate: formatDate(endDate), // format as YYYY-MM-DD
    };


    const prefetchOptions = [
        {
            queryKey: ['salesCards', ChartFilter.DAY, date, ChartContext.TOPSALES],
            queryFn: () => getSalesCards({
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                filter: ChartFilter.DAY,
                comparedStartDate: formatDate(comparedStartDate),
                comparedEndDate: formatDate(comparedEndDate),
                context: ChartContext.TOPSALES,
            }),
        },
        {
            queryKey: ['salesCharts', ChartFilter.DAY, date, ChartContext.TOPSALES],
            queryFn: () => getSalesCharts({
                startDate: formatDate(startDate),
                endDate: formatDate(endDate),
                filter: ChartFilter.DAY,
                comparedStartDate: formatDate(comparedStartDate),
                comparedEndDate: formatDate(comparedEndDate),
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