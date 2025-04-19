"use client";

import React, {Fragment, Suspense, useEffect, useState} from "react";
import {useInView} from "react-intersection-observer";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import ProductCard from "@/components/Home/Product/ProductCard";
import {Product} from "@/interface/Product";
import ProductFilters from "@/components/Home/Product/ProductFilters";
import {Category} from "@/interface/Category";
import ProductCategories from "@/components/Home/Product/ProductCategories";
import {Size} from "@/types/size";
import ProductOrders from "@/components/Home/Product/ProductOrders";
import {useSearchParams} from "next/navigation";
import FiltersBadge from "@/components/Home/Product/FiltersBadge";
import {getCategories, getCategory} from "@/apis/adminAPI";
import {getProductList} from "@/apis/mallAPI";
import ProductCardSkeleton from "@/components/Skeleton/ProductCartSkeleton";
import ProductCardListSkeleton from "@/components/Skeleton/ProductCartListSkeleton";
import ListPageSkeleton from "@/components/Skeleton/ListPageSkeleton";

export type SortOption = {
    name: string;
    href: string;
    current: boolean;
};


export type FilterOption = {
    value: string;
    label: string;
    hexCode?: string;
    checked: boolean;
};

export type FilterSection = {
    id: string;
    name: string;
    options: FilterOption[] ;
};

const filters: FilterSection[] = [
    {
        id: 'size',
        name: 'Size',
        options: [
            {value: Size.XS, label: 'XS', checked: false},
            {value: Size.S, label: 'S', checked: false},
            {value: Size.M, label: 'M', checked: false},
            {value: Size.L, label: 'L', checked: false},
            {value: Size.XL, label: 'XL', checked: false},
            {value: Size.XXL, label: '2XL', checked: false},
            {value: Size.XXXL, label: '3XL', checked: false},
            {value: Size.FREE, label: 'FREE', checked: false},
        ],
    },
    {
        id: 'category',
        name: 'Category',
        options: [
            {value: 'new-arrivals', label: 'New Arrivals', checked: false},
            {value: 'sale', label: 'Sale', checked: false},
            {value: 'travel', label: 'Travel', checked: true},
            {value: 'organization', label: 'Organization', checked: false},
            {value: 'accessories', label: 'Accessories', checked: false},
        ],
    },
    {
        id: 'color',
        name: 'Color',
        options: [
            {value: 'white', label: 'White', hexCode: '#FFFFFF', checked: false},
            {value: 'red', label: 'Red', hexCode: '#FF6961', checked: false},
            {value: 'beige', label: 'Beige', hexCode: '#F5F5DC', checked: false},
            {value: 'blue', label: 'Blue', hexCode: '#AEC6CF', checked: false},
            {value: 'brown', label: 'Brown', hexCode: '#cebaa0', checked: false},
            {value: 'green', label: 'Green', hexCode: '#77DD77', checked: false},
            {value: 'purple', label: 'Purple', hexCode: '#C3B1E1', checked: false},
        ],
    },
];


interface Props {
    categoryId?: string;
    colors: string[];
    sizes: string[];
    minPrice: string;
    maxPrice: string;
    order: string;
    query: string;
}

export interface Params {
    key: string;
    value: string;
}

const ProductList = ({categoryId = "", colors, sizes, minPrice, maxPrice, order, query}: Props) => {
    const searchParams = useSearchParams();
    const searchValue = searchParams.get("query");
    // 모든 쿼리 파라미터를 [{ key, value }] 형태로 변환
    const paramsArray: Params[] = Array.from(searchParams.entries()).map(([key, value]) => ({
        key,
        value
    }));

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

    const {
        data: products,
        hasNextPage,
        isFetching,
        isLoading,
        fetchNextPage,
        isError,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['products', categoryId, colors, sizes, minPrice, maxPrice, order, query],
        queryFn: ({pageParam, meta}) => {
            return getProductList({
                queryKey: ['products', categoryId, colors, sizes, minPrice, maxPrice, order, query],
                page: pageParam,
                row: 2,
                categoryId: categoryId,
                colors: colors,
                productSizes: sizes,
                minPrice,
                maxPrice,
                order,
                query,
            });
        },
        getNextPageParam: (lastPage, allPages) => {
            // 만약 현재 페이지의 상품 목록이 비어있다면, 다음 페이지가 없음을 의미
            if (lastPage.dtoList.length === 0) {
                return undefined;
            }
            return lastPage.current + 1;
        },
        initialPageParam: 1,
        staleTime: 60 * 1000,
        retry: 0,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });


    const allProducts = products?.pages.flatMap(page => page.dtoList) || [];

    const {data: categories} = useQuery<Array<Category>, Object, Array<Category>>({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
    });

    const {data: category} = useQuery<Category, Object, Category, [_1: string, _2: string]>({
        queryKey: ['category', categoryId],
        queryFn: getCategory,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
        enabled : !!categoryId, //categoryId가 있을 때만 쿼리 요청
    });

    const { ref, inView } = useInView({
        rootMargin: "200px", // 뷰포트에서 200px 떨어져도 미리 감지
        threshold: 0,
    });

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);


    if (isLoading) {
        return (
           <ListPageSkeleton/>
        );
    }
    

    return (
        <div className="bg-white">
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                    {
                        searchValue ?
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                                    검색결과
                                </h1>
                                <p className="text-sm md:text-base text-slate-500 my-3.5">
                                    {query}
                                </p>
                            </div>
                            :
                            <div>
                                <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                                    {category?.cname || "전체검색"}
                                </h1>
                                <p className="text-sm md:text-base text-slate-500 my-3.5">
                                    {category?.cdesc || "전체검색 결과입니다."}
                                </p>
                            </div>
                    }
                </div>

                <section aria-labelledby="products-heading" className="pb-24 pt-6">
                    <h2 id="products-heading" className="sr-only">
                        Products
                    </h2>

                    <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
                        {/* Filters */}
                        <form className="hidden lg:block">
                            <ProductCategories categories={categories || []}/>
                            <ProductFilters filters={filters}/>
                        </form>
                        {/* Product Grid */}
                        <div className="lg:col-span-3">
                            {/*Badges*/}
                            <div className="w-full flex justify-between items-center">
                                <div className="flex flex-wrap gap-2">
                                    {
                                        paramsArray?.map((param: Params, index: number) =>
                                            param.key === "category_id" ?
                                                <FiltersBadge key={index} category={category} param={param}/> :
                                                <FiltersBadge key={index} param={param}/>
                                        )
                                    }
                                </div>

                                {/* Orders */}
                                <ProductOrders/>
                            </div>

                            <div
                                className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                                {
                                    allProducts.length < 1 ? (
                                        <div>상품이 없습니다.</div>
                                    ) : (
                                        products?.pages.map((page, index) => (
                                            <Fragment key={index}>
                                                {page.dtoList.map((product: Product) => (
                                                    <Suspense fallback={<ProductCardSkeleton/>} key={product.pno}>
                                                        <ProductCard product={product}/>
                                                    </Suspense>
                                                ))}
                                            </Fragment>
                                        ))
                                    )
                                }
                            </div>

                            {isFetchingNextPage ? (
                                <div className="mt-6">
                                    <ProductCardListSkeleton />
                                </div>
                            ) : hasNextPage ? (
                                <div ref={ref} className="h-10 flex justify-center items-center mt-4">
                                    스크롤을 내려주세요.
                                </div>
                            ) : (
                                <div className="mt-4 flex justify-center items-center">
                                    더 이상 없습니다.
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default ProductList;