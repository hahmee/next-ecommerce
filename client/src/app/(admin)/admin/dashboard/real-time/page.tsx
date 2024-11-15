"use server";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {ChartFilter} from "@/types/chartFilter";
import RealtimeOverview from "@/components/Admin/Dashboard/RealtimeOverview";
import {getGARecentUsers} from "@/api/dashbaordAPI";
import {getCookie} from "@/utils/cookie";

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
        startDate: startDate.toISOString().split("T")[0], // format as YYYY-MM-DD
        endDate: endDate.toISOString().split("T")[0], // format as YYYY-MM-DD
    };

    const member = await getCookie("member");

    const prefetchOptions = [
        {
            queryKey: ['gaRecentUsers', date, ChartFilter.DAY],
            queryFn: () => getGARecentUsers(
                {
                    startDate: startDate.toISOString().split("T")[0],
                    endDate: endDate.toISOString().split("T")[0],
                    sellerEmail: member?.email || "",
                    filter: ChartFilter.DAY,
                    comparedStartDate: comparedStartDate.toISOString().split("T")[0],
                    comparedEndDate: comparedEndDate.toISOString().split("T")[0],
                }
            ),
        },
    ]

    return <div className="mx-auto">
        <Breadcrumb pageName="Real-time Overview"/>
        <div className="flex flex-col gap-5">
            <Suspense fallback={<Loading/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <RealtimeOverview/>
                </PrefetchBoundary>
            </Suspense>
        </div>
    </div>
}