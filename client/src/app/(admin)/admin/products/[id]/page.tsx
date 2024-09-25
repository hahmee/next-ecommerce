"use server";

import React, {Suspense} from "react";
import ProductForm from "@/components/Admin/Product/ProductForm";
import {Mode} from "@/types/mode";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import {getProduct} from "@/app/(admin)/admin/products/[id]/_lib/getProduct";
import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";
import {getCategoryPaths} from "@/app/(admin)/admin/category/edit-category/[id]/_lib/getCategoryPaths";

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
            queryFn: () => getCategories()
        },
        {
            queryKey: ['categoryPaths', id],
            queryFn: () => getCategoryPaths({queryKey: ['categoryPaths', id]})
        }
    ];

    return (
        <Suspense fallback={<Loading/>}>
            {/*<PrefetchBoundary prefetchOptions={allMemosQueryOptions(id)}>*/}
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <ProductForm type={Mode.EDIT} id={id}/>
            </PrefetchBoundary>
        </Suspense>

    );

}

