import SalesOverview from "@/components/Admin/Dashboard/SalesOverview";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import {getSalesCharts} from "@/app/(admin)/admin/dashboard/_lib/getSalesCharts";

export default function DashBoardPage() {

    const prefetchOptions =
        {
            queryKey: ['salesCharts'],
            queryFn: () => getSalesCharts({startDate: '20241001', endDate:'20241015',sellerEmail:'user1@aaa.com', filter: 'day' }),
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