"use server";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {ChartFilter} from "@/types/chartFilter";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";
import {getGARecentUsersTop} from "@/apis/dashbaordAPI";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
import RealtimeOverview from "@/components/Admin/Dashboard/RealtimeOverview";
import dayjs from "dayjs";

export default async function DashBoardRealTimePage() {
    const today = dayjs(); // 오늘
    const endDate = today;
    const startDate = today.subtract(30, "day"); // 30일 전

    const comparedEndDate = startDate.subtract(1, "day");
    const comparedStartDate = comparedEndDate.subtract(30, "day");

    const date = {
        startDate: startDate.format("YYYY-MM-DD"),
        endDate: endDate.format("YYYY-MM-DD"),
    };

    const prefetchOptions = [
        {
            queryKey: ['gaRecentUsersTop', date, ChartFilter.DAY],
            queryFn: () => getGARecentUsersTop(
                {
                    startDate: startDate.format("YYYY-MM-DD"),
                    endDate: endDate.format("YYYY-MM-DD"),
                    filter: ChartFilter.DAY,
                    comparedStartDate: comparedStartDate.format("YYYY-MM-DD"),
                    comparedEndDate: comparedEndDate.format("YYYY-MM-DD"),
                }
            ),
        },
    ]

    return <div className="mx-auto">
        <Breadcrumb pageName="Real-time Overview"/>
        <div className="flex flex-col gap-5">
            <Suspense fallback={<DashboardSkeleton/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <ErrorHandlingWrapper>
                        <RealtimeOverview/>
                    </ErrorHandlingWrapper>
                </PrefetchBoundary>
            </Suspense>
        </div>
    </div>;
}