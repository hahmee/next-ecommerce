import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import StockTable from "@/components/Tables/StockTable";
import {getProductsByEmail} from "@/api/adminAPI";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";

export default function StockPage() {

    const prefetchOptions =
        {
            queryKey: ['adminStockProducts', {page:1, size:10, search:""}],
            queryFn: () => getProductsByEmail({page: 1, size: 10, search:""}),
        }

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Stock"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <StockTable/>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    );

};