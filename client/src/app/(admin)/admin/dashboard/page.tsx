"use server";

import SalesOverview from "@/components/Admin/Dashboard/SalesOverview";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import {getSalesCharts} from "@/app/(admin)/admin/dashboard/_lib/getSalesCharts";
import {getCookie} from "@/utils/getCookieUtil";
import {ChartFilter} from "@/types/chartFilter";
import {ChartContext} from "@/types/chartContext";
import {getSalesCards} from "@/app/(admin)/admin/dashboard/_lib/getSalesCards";
import {getTopCustomers} from "@/app/(admin)/admin/dashboard/_lib/getTopCustomers";

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
            queryKey: ['salesCards', ChartFilter.DAY, date, ChartContext.TOPSALES],
            queryFn: () => getSalesCards({
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
                sellerEmail: member?.email || "",
                filter: ChartFilter.DAY,
                comparedStartDate: comparedStartDate.toISOString().split("T")[0],
                comparedEndDate: comparedEndDate.toISOString().split("T")[0],
                context: ChartContext.TOPSALES,
            }),
        },
        {
            queryKey: ['salesCharts', ChartFilter.DAY, date, ChartContext.TOPSALES],
            queryFn: () => getSalesCharts({
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
                sellerEmail: member?.email || "",
                filter: ChartFilter.DAY,
                comparedStartDate: comparedStartDate.toISOString().split("T")[0],
                comparedEndDate: comparedEndDate.toISOString().split("T")[0],
                context: ChartContext.TOPSALES,
            }),
        },
        {
            queryKey: ['customers'],
            queryFn: () => getTopCustomers({
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
                sellerEmail: member?.email || "",
            }),
        },
    ]

    return <div className="mx-auto">
        <Breadcrumb pageName="Sales Overview"/>
        <div className="flex flex-col gap-5">
            <Suspense fallback={<Loading/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <SalesOverview/>
                </PrefetchBoundary>
            </Suspense>
        </div>
    </div>
}