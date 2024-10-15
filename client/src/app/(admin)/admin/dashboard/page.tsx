"use server";

import SalesOverview from "@/components/Admin/Dashboard/SalesOverview";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import {getSalesCharts} from "@/app/(admin)/admin/dashboard/_lib/getSalesCharts";
import {getCookie} from "@/utils/getCookieUtil";

export default async function DashBoardPage() {
    const endDate = new Date(); // today
    const startDate = new Date();
    const comparedEndDate = new Date();
    const comparedStartDate = new Date();
    startDate.setDate(endDate.getDate() - 30); // 30 days ago
    comparedEndDate.setDate(endDate.getDate() - 1);
    comparedStartDate.setDate(comparedEndDate.getDate() - 30); // 30 days ago

    const member = getCookie("member");

    const prefetchOptions =
        {
            queryKey: ['salesCharts'],
            queryFn: () => getSalesCharts({
                startDate: startDate.toISOString().split("T")[0],
                endDate: endDate.toISOString().split("T")[0],
                sellerEmail: member?.email || "",
                filter: 'day',
                comparedStartDate: comparedStartDate.toISOString().split("T")[0],
                comparedEndDate: comparedEndDate.toISOString().split("T")[0],
            }),
        };

    return <div className="mx-auto">
        <Breadcrumb pageName="Sales Overview"/>
        <div className="flex flex-col gap-10">
            <Suspense fallback={<Loading/>}>
                <PrefetchBoundary prefetchOptions={prefetchOptions}>
                    <SalesOverview/>
                </PrefetchBoundary>
            </Suspense>
        </div>
    </div>
}