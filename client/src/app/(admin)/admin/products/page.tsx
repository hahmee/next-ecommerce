import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import ProductTable from "@/components/Tables/ProductTable";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";


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
                <Suspense fallback={<Loading/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <ProductTable/>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    );

};