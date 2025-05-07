import React, {Suspense} from "react";
import ProductSingle from "@/components/Home/Product/ProductSingle";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getProduct, getReviews} from "@/apis/adminAPI";
import ProductSingleSkeleton from "@/components/Skeleton/ProductSingleSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";

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
                <ErrorHandlingWrapper>
                    <ProductSingle id={id}/>
                </ErrorHandlingWrapper>
            </PrefetchBoundary>
        </Suspense>
    );
}