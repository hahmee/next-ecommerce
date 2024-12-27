import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import OrderTable from "@/components/Tables/OrderTable";
import {getOrdersByEmail} from "@/api/adminAPI";
import {TableSkeleton} from "@/components/Skeleton/TableSkeleton";

export default async function AdminOrderPage() {
    // const endDate = new Date(); // today
    // const startDate = new Date(); // today
    //테이블 기간
    const date = {
        startDate: null,// startDate.toISOString().split("T")[0], // format as YYYY-MM-DD
        endDate: null, //endDate.toISOString().split("T")[0], // format as YYYY-MM-DD
    };

    const prefetchOptions = {
        queryKey: ['adminOrders', {page: 1, size: 10, search: "", date}],
        queryFn: () => getOrdersByEmail({page: 1, size: 10, search: "", startDate:  date.startDate ?? "", endDate:  date.endDate ?? ""}),
    };

    return (
        <>
            {/* 포탈을 위한 DOM 요소 */}
            <div className="mx-auto my-auto hd-auto">
                <Breadcrumb pageName="Orders"/>
                <div className="flex flex-col gap-10 ">
                    <Suspense fallback={<TableSkeleton/>}>
                        <PrefetchBoundary prefetchOptions={prefetchOptions}>
                            <OrderTable/>
                        </PrefetchBoundary>
                    </Suspense>
                </div>
            </div>
        </>
    );
};
