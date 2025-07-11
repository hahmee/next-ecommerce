"use server";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import TrafficOverview from "@/components/Admin/Dashboard/TrafficOverview";
import {ChartFilter} from "@/types/chartFilter";
import {getGoogleAnalyticsTop} from "@/apis/dashbaordAPI";
import formatDate from "@/libs/formatDate";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

export default async function DashBoardTrafficPage() {
    const endDate = new Date(); // today
    const startDate = new Date(); // today

    startDate.setDate(endDate.getDate() - 31); // 31 days ago
    endDate.setDate(endDate.getDate() - 1); // 1 days ago

    // 새로운 날짜 계산
    const comparedEndDate = new Date(startDate); // endDate 복사
    comparedEndDate.setDate(startDate.getDate() - 1); // 1일 빼기

    const comparedStartDate = new Date(comparedEndDate); // newEndDate 복사
    comparedStartDate.setDate(comparedEndDate.getDate() - 30); // 차이만큼 날짜 빼기

    const date = {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
    };

    // const member = await getCookie("member");

    const prefetchOptions = [
        {
            queryKey: ['gaTop', date, ChartFilter.DAY],
            queryFn: () => getGoogleAnalyticsTop(
                {
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate),
                    filter: ChartFilter.DAY,
                    comparedStartDate: formatDate(comparedStartDate),
                    comparedEndDate: formatDate(comparedEndDate),
                }
            ),
        },
    ]

    return <div className="mx-auto">
        <Breadcrumb pageName="Traffic Overview"/>
        <div className="flex flex-col gap-5">
            <Suspense fallback={<DashboardSkeleton/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <ErrorHandlingWrapper>
                        <TrafficOverview/>
                    </ErrorHandlingWrapper>
                </PrefetchBoundary>
            </Suspense>
        </div>
    </div>;
}