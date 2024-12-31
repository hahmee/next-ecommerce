import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import ProductTable from "@/components/Admin/Tables/ProductTable";
import {getProductsByEmail} from "@/apis/adminAPI";
import {TableSkeleton} from "@/components/Skeleton/TableSkeleton";


export default async function ProductsPage() {

    const prefetchOptions =
        {
            queryKey: ['adminProducts', {page:1, size:10, search:""}],
            queryFn: () => getProductsByEmail({page: 1, size: 10, search:""}),
        }

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Products"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<TableSkeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <ProductTable/>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    );

};