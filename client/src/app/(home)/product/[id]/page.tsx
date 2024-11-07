import {QueryClient} from "@tanstack/react-query";
import React, {Suspense} from "react";
import ProductSingle from "@/components/Home/ProductSingle";
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import {getProduct, getReviews} from "@/api/adminAPI";

interface Props {
    params: {id: string }
}

export default async function ProductSinglePage({params}: Props) {

    const {id} = params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({queryKey: ['productCustomerSingle', id], queryFn: getProduct});

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
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchOptions={prefetchOptions}>
                <ProductSingle id={id}/>
            </PrefetchBoundary>
        </Suspense>
    )
}