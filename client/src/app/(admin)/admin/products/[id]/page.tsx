"use server";

import React, {Suspense} from "react";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {Mode} from "@/types/mode";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getCategories, getCategoryPaths, getProduct} from "@/apis/adminAPI";
import ProductFormSkeleton from "@/components/Skeleton/ProductFormSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
import {clientFetcher} from "@/utils/clientFetcher";

interface Props {
    params: {id: string }
}

export default async function ModifyProductPage({params}: Props) {
    const {id} = params;

    const prefetchOptions = [
        {
            queryKey: ['productSingle', id],
            queryFn: () => getProduct({queryKey: ['productSingle', id]}), // queryKey를 전달하여 호출
        },
        {
            queryKey: ['categories'],
            // queryFn: () => getCategories()
            queryFn: () =>  clientFetcher("/api/category/list"),
        },
        {
            queryKey: ['categoryPaths', id],
            queryFn: () => getCategoryPaths({queryKey: ['categoryPaths', id]})
        }
    ];

    return (
        <Suspense fallback={<ProductFormSkeleton/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <ErrorHandlingWrapper>
                    <ProductForm type={Mode.EDIT} id={id}/>
                </ErrorHandlingWrapper>
            </PrefetchBoundary>
        </Suspense>

    );

}

