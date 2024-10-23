import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";
import OrderTable from "@/components/Tables/OrderTable";
import {getPaymentsByEmail} from "@/app/(admin)/admin/order/_lib/getPaymentsByEmail";

export default async function AdminOrderPage() {

    const prefetchOptions =
        {
            queryKey: ['adminPayments', {page:1, size:10, search:""}],
            queryFn: () => getPaymentsByEmail({page: 1, size: 10, search:""}),
        }

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Orders"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <OrderTable/>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    );
};
