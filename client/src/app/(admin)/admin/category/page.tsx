import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import CategoryTable from "@/components/Tables/CategoryTable";
import {getAdminCategories} from "@/api/adminAPI";

export default function CategoryPage() {

    const prefetchOptions =
        {
            queryKey: ['categories', {page: 1, size: 10, search: ""}],
            queryFn: () => getAdminCategories({page: 1, size: 10, search:""}),
        }

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Categories"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <CategoryTable/>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    );

};