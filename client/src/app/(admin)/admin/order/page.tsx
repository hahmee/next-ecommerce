import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import OrderTable from "@/components/Admin/Tables/OrderTable";
import {getOrdersByEmail} from "@/apis/adminAPI";
import {TableSkeleton} from "@/components/Skeleton/TableSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

export default async function AdminOrderPage() {

    //테이블 기간
    const date = {
        startDate: null,
        endDate: null,
    };

    const prefetchOptions = {
        queryKey: ['adminOrders', {page: 1, size: 10, search: "", date}],
        queryFn: () => getOrdersByEmail({page: 1, size: 10, search: "",
            startDate: date.startDate ? new Date(date.startDate).toLocaleDateString('en-CA') : "",
            endDate: date.endDate ? new Date(date.endDate).toLocaleDateString('en-CA') : "",
        }),
    };

    return (
        <>
            {/* 포탈을 위한 DOM 요소 */}
            <div className="mx-auto my-auto hd-auto">
                <Breadcrumb pageName="Orders"/>
                <div className="flex flex-col gap-10 ">
                    <Suspense fallback={<TableSkeleton/>}>
                        <PrefetchBoundary prefetchOptions={prefetchOptions}>
                            <ErrorHandlingWrapper>
                                <OrderTable/>
                            </ErrorHandlingWrapper>
                        </PrefetchBoundary>
                    </Suspense>
                </div>
            </div>
        </>
    );
};
