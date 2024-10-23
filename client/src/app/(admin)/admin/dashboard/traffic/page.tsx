"use server";

import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getCookie} from "@/utils/getCookieUtil";
import TrafficOverview from "@/components/Admin/Dashboard/TrafficOverview";
import {getGoogleAnalytics} from "@/app/(admin)/admin/dashboard/_lib/getGoogleAnalytics";

export default async function DashBoardPage() {
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

    const member = getCookie("member");

    const prefetchOptions = [
        {
            queryKey: ['ga', date],
            queryFn: () => getGoogleAnalytics(
                {
                    startDate: startDate.toISOString().split("T")[0],
                    endDate: endDate.toISOString().split("T")[0],
                    sellerEmail: member?.email || "",
                    comparedStartDate: comparedStartDate.toISOString().split("T")[0],
                    comparedEndDate: comparedEndDate.toISOString().split("T")[0],
                }
            ),
        },
    ]

    return <div className="mx-auto">
        <Breadcrumb pageName="Traffic Overview"/>
        <div className="flex flex-col gap-5">
            <Suspense fallback={<Loading/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <TrafficOverview/>
                </PrefetchBoundary>
            </Suspense>
        </div>
    </div>
}