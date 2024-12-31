import React, {Suspense} from "react";
import ProductSingle from "@/components/Home/Product/ProductSingle";
import Loading from "@/app/(admin)/admin/profile/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getProduct, getReviews} from "@/apis/adminAPI";
import ProductSingleSkeleton from "@/components/Skeleton/ProductSingleSkeleton";

interface Props {
    params: {id: string }
}

export default async function ProductSinglePage({params}: Props) {

    const {id} = params;

    const prefetchOptions = [
        {
            queryKey: ['productCustomerSingle', id],
            queryFn: () => getProduct({queryKey: ['productCustomerSingle', id]}),
        },
        {
            queryKey: ['reviews', id],
            queryFn: () => getReviews({queryKey: ['reviews', id]}),
        }
    ];
    return (
        <Suspense fallback={<ProductSingleSkeleton/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <ProductSingle id={id}/>
            </PrefetchBoundary>
        </Suspense>
    )
}