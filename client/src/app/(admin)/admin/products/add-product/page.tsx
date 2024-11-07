import React, {Suspense} from "react";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {Mode} from "@/types/mode";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getCategories} from "@/api/adminAPI";

export default function AddProductPage() {

    const prefetchOptions = [
        {
            queryKey: ['categories'],
            queryFn: () => getCategories()
        }
    ];

    return (
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                 <ProductForm type={Mode.ADD}/>
            </PrefetchBoundary>
        </Suspense>
    );
}