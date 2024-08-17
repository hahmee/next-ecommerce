import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import React, {Suspense} from "react";
import Loading from "@/app/(admin)/admin/products/loading";
import ProductTableSuspense from "@/components/Admin/ProductTableSuspense";

export default function ProductsPage({params, searchParams}: {
    params: { slug: string },
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    return (
        <div className="mx-auto">
            <Breadcrumb pageName="Products"/>
            <div className="flex flex-col gap-10">
                <Suspense fallback={<Loading/>}>
                    <ProductTableSuspense page = {Number(searchParams.page)} size={Number(searchParams.size)}/>
                </Suspense>
            </div>
        </div>
    );

};