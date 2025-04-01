"use server";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {ChartFilter} from "@/types/chartFilter";
import {getCookie} from "@/utils/cookie";
import formatDate from "@/libs/formatDate";
import DashboardSkeleton from "@/components/Skeleton/DashboardSkeleton";
import RealtimeOverview from "@/components/Admin/Dashboard/RealtimeOverview";
import {getGARecentUsersTop} from "@/apis/dashbaordAPI";

export default async function DashBoardRealTimePage() {
    const endDate = new Date(); // today
    const startDate = new Date(); // today

    startDate.setDate(endDate.getDate() - 30); // 30 days ago

    // 새로운 날짜 계산
    const comparedEndDate = new Date(startDate); // endDate 복사
    comparedEndDate.setDate(startDate.getDate() - 1); // 1일 빼기

    const comparedStartDate = new Date(comparedEndDate); // newEndDate 복사
    comparedStartDate.setDate(comparedEndDate.getDate() - 30); // 차이만큼 날짜 빼기

    const date = {
        startDate: formatDate(startDate), // format as YYYY-MM-DD
        endDate: formatDate(endDate), // format as YYYY-MM-DD
    };

    const member = await getCookie("member");

    const prefetchOptions = [
        {
            queryKey: ['gaRecentUsersTop', date, ChartFilter.DAY],
            queryFn: () => getGARecentUsersTop(
                {
                    startDate: formatDate(startDate),
                    endDate: formatDate(endDate),
                    sellerEmail: member?.email || "",
                    filter: ChartFilter.DAY,
                    comparedStartDate: formatDate(comparedStartDate),
                    comparedEndDate: formatDate(comparedEndDate),
                }
            ),
        },
    ]

    return <div className="mx-auto">
        <Breadcrumb pageName="Real-time Overview"/>
        <div className="flex flex-col gap-5">
            <Suspense fallback={<DashboardSkeleton/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <div>asdfasdf</div>
                    {/*<RealtimeOverview/>*/}
                </PrefetchBoundary>
            </Suspense>
        </div>
    </div>
}