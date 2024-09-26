import React, {Suspense} from 'react'
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import ProductList from "@/components/Home/ProductList";
import {getProductList} from "@/app/(home)/list/_lib/getProductList";


export default async function ListPage() {

    const prefetchInfiniteOptions = [
        {
            queryKey: ['products'],
            queryFn: () => getProductList({queryKey: ['products'], startCount:1, row:1}),
            initialPageParam: 1,
        },
    ];
    return (
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchInfiniteOptions={prefetchInfiniteOptions}>
                <ProductList/>
            </PrefetchBoundary>
        </Suspense>
    )
}


