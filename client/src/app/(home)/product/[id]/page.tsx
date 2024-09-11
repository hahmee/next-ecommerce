import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import React from "react";
import {getProduct} from "@/app/(admin)/admin/products/[id]/_lib/getProduct";
import ProductSingle from "@/components/Home/ProductSingle";

interface Props {
    params: {id: string }
}

export default async function ProductSinglePage({params}: Props) {

    const {id} = params;

    const queryClient = new QueryClient();

    await queryClient.prefetchQuery({queryKey: ['id', id], queryFn: getProduct});
    const dehydratedState = dehydrate(queryClient);

    return (
        <HydrationBoundary state={dehydratedState}>
            <ProductSingle id={id}/>
        </HydrationBoundary>
    )
}