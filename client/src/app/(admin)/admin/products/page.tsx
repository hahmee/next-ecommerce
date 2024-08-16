import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import ProducetTableSuspense from "@/components/Admin/ProducetTableSuspense";

export default function ProductsPage() {
    return (<div className="mx-auto">
        <Breadcrumb pageName="Products"/>
        <div className="flex flex-col gap-10">
            <Suspense fallback={<Loading/>}>
                <ProducetTableSuspense/>
            </Suspense>
        </div>
    </div>);

};