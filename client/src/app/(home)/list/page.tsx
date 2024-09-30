import React, {Suspense} from 'react'
import Loading from "@/app/(admin)/admin/products/loading";
import {PrefetchBoundary} from "@/lib/PrefetchBoundary";
import ProductList, {ROWS_PER_PAGE} from "@/components/Home/ProductList";
import {getProductList} from "@/app/(home)/list/_lib/getProductList";
import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";
import {getCategory} from "@/app/(admin)/admin/category/edit-category/[id]/_lib/getProduct";
import {FetchInfiniteQueryOptions} from "@tanstack/react-query";

interface Props {
    searchParams: { [key: string]: string | string[] | undefined }
}

export default async function ListPage({searchParams}: Props) {

    // categoryId가 배열이면 첫 번째 값을, 아니면 그대로 사용
    const categoryId = Array.isArray(searchParams.category_id)
        ? searchParams.category_id[0]  // 배열인 경우 첫 번째 값을 사용
        : searchParams.category_id || ''; // undefined면 빈 문자열 처리

    console.log('searchParams', categoryId);

    const prefetchInfiniteOptions: FetchInfiniteQueryOptions[] = [
        {
            queryKey: ['products', categoryId],
            queryFn: ({pageParam = 1}) => getProductList({queryKey: ['products'], page: pageParam as number, row: ROWS_PER_PAGE, categoryId: categoryId }),
            initialPageParam: 1,
            staleTime: 30 * 1000, // 바로 stale 상태로 변경되는 것을 방지하기 위해 30초로 설정
        },
    ];

    const prefetchOptions = [
        {
            queryKey: ['categories'],
            queryFn: () => getCategories()
        },
        {
            queryKey: ['category', categoryId],
            queryFn: () => getCategory({queryKey: ['category', categoryId]}),
        }
    ];

    return (
        <Suspense fallback={<Loading/>}>
            <PrefetchBoundary prefetchInfiniteOptions={prefetchInfiniteOptions} prefetchOptions={prefetchOptions}>
                <ProductList categoryId={categoryId}/>
            </PrefetchBoundary>
        </Suspense>
    )
};


