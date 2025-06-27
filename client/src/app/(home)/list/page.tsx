import React, {Suspense} from 'react'
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import ProductList from "@/components/Home/Product/ProductList";
import {FetchInfiniteQueryOptions} from "@tanstack/react-query";
import {getCategories, getCategory} from "@/apis/adminAPI";
import {getProductList} from "@/apis/mallAPI";
import ListPageSkeleton from "@/components/Skeleton/ListPageSkeleton";
import ErrorHandlingWrapper from '@/components/ErrorHandlingWrapper';

interface Props {
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata({ searchParams }: Props) {
    const categoryId = Array.isArray(searchParams.category_id)
      ? searchParams.category_id[0]
      : searchParams.category_id || "";

    const query = Array.isArray(searchParams.query)
      ? searchParams.query[0]
      : searchParams.query || "";

    let categoryName = "";

    try {
        if (categoryId) {
            const categoryRes = await getCategory({
                queryKey: ["category", categoryId],
            });
            categoryName = categoryRes?.cname || categoryName;
        }
    } catch (e) {
        // fallback 유지
    }

    return {
        title: categoryName ? `${categoryName} 상품 목록`: '전체상품 목록',
        description: query
          ? `"${query}" 검색 결과를 포함한 ${categoryName} 상품들을 확인해보세요.`
          : `${categoryName} 카테고리의 다양한 상품을 탐색해보세요.`,
        openGraph: {
            title: `${categoryName} 상품`,
            description: "카테고리별 인기 상품을 한눈에 확인해보세요.",
            url: `${process.env.NEXT_PUBLIC_BASE_URL}/list?query=${query}&category_id=${categoryId}`,
        },
        twitter: {
            card: "summary",
            title: `${categoryName} 상품 목록`,
            description: "Next E-commerce 인기 상품을 확인하세요.",
        },
    };
}

export default async function ListPage({searchParams}: Props) {

    // categoryId가 배열이면 첫 번째 값을, 아니면 그대로 사용
    const categoryId = Array.isArray(searchParams.category_id)
        ? searchParams.category_id[0]  // 배열인 경우 첫 번째 값을 사용
        : searchParams.category_id || ''; // undefined면 빈 문자열 처리

    const colors = Array.isArray(searchParams.color) ? searchParams.color : searchParams.color ? [searchParams.color] : [];
    const sizes = Array.isArray(searchParams.size) ? searchParams.size : searchParams.size ? [searchParams.size] : [];

    const minPrice = Array.isArray(searchParams.minPrice)
        ? searchParams.minPrice[0]  // 배열인 경우 첫 번째 값을 사용
        : searchParams.minPrice || ''; // undefined면 빈 문자열 처리

    const maxPrice = Array.isArray(searchParams.maxPrice)
        ? searchParams.maxPrice[0]  // 배열인 경우 첫 번째 값을 사용
        : searchParams.maxPrice || ''; // undefined면 빈 문자열 처리

    const order = Array.isArray(searchParams.order)
        ? searchParams.order[0]  // 배열인 경우 첫 번째 값을 사용
        : searchParams.order || ''; // undefined면 빈 문자열 처리

    const query = Array.isArray(searchParams.query)
        ? searchParams.query[0]  // 배열인 경우 첫 번째 값을 사용
        : searchParams.query || ''; // undefined면 빈 문자열 처리

    const prefetchInfiniteOptions: FetchInfiniteQueryOptions[] = [
        {
            queryKey: ['products', categoryId, colors, sizes, minPrice, maxPrice, order,query],
            queryFn: ({pageParam}) => getProductList({queryKey: ['products',  categoryId, colors, sizes, minPrice, maxPrice,order,query], page: pageParam as number, row: 1 , categoryId: categoryId, colors, productSizes:sizes, minPrice, maxPrice,order,query}),
            initialPageParam: 1,
            staleTime: Infinity,// 30 * 1000, // 바로 stale 상태로 변경되는 것을 방지하기 위해 30초로 설정
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
        <Suspense fallback={<ListPageSkeleton/>}>
            <PrefetchBoundary prefetchInfiniteOptions={prefetchInfiniteOptions} prefetchOptions={prefetchOptions}>
                <ErrorHandlingWrapper>
                    <ProductList categoryId={categoryId} colors={colors} sizes={sizes} minPrice={minPrice} maxPrice={maxPrice} order={order} query={query}/>
                </ErrorHandlingWrapper>
            </PrefetchBoundary>
        </Suspense>
    );
};


