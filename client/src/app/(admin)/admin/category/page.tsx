import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import CategoryTableSuspense from "@/components/Admin/CategoryTableSuspense";

export default function CategoryPage() {

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Categories"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    <CategoryTableSuspense/>
                </Suspense>
            </div>
        </div>
    );

};