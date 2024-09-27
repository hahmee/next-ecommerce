import React, {Suspense} from 'react'
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import ProductList, {ROWS_PER_PAGE} from "@/components/Home/ProductList";
import {getProductList} from "@/app/(home)/list/_lib/getProductList";


export default async function ListPage() {

    const prefetchInfiniteOptions = [
        {
            queryKey: ['products'],
            queryFn: ({pageParam=1 }) => getProductList({queryKey: ['products'], page: pageParam, row: ROWS_PER_PAGE}),
            initialPageParam: 1,
            staleTime: 30 * 1000, // 바로 stale 상태로 변경되는 것을 방지하기 위해 30초로 설정
        },
    ];

    // queryFn: () => getProductList({queryKey: ['products'], page:1, row:1}),

    return (
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchInfiniteOptions={prefetchInfiniteOptions}>
                <ProductList />
            </PrefetchBoundary>
        </Suspense>
    )
}


