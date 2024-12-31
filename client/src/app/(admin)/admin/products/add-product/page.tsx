import React, {Suspense} from "react";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {Mode} from "@/types/mode";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getCategories} from "@/apis/adminAPI";
import ProductFormSkeleton from "@/components/Skeleton/ProductFormSkeleton";

export default function AddProductPage() {

    const prefetchOptions = [
        {
            queryKey: ['categories'],
            queryFn: () => getCategories()
        }
    ];

    return (
        <Suspense>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                 <ProductForm type={Mode.ADD}/>
            </PrefetchBoundary>
        </Suspense>
    );
}