"use client";

import {FunnelIcon, Squares2X2Icon} from "@heroicons/react/20/solid";
import React, {Fragment, useCallback, useEffect, useState} from "react";
import {useInView} from "react-intersection-observer";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import ProductCard from "@/components/Home/ProductCard";
import {Product} from "@/interface/Product";
import ProductFilters from "@/components/Home/ProductFilters";
import {DataResponse} from "@/interface/DataResponse";
import {Category} from "@/interface/Category";
import ProductCategories from "@/components/Home/ProductCategories";
import {Size} from "@/types/size";
import ProductOrders from "@/components/Home/ProductOrders";
import {useSearchParams} from "next/navigation";
import FiltersBadge from "@/components/Home/FiltersBadge";
import {getCategories, getCategory} from "@/api/adminAPI";
import {getProductList} from "@/api/mallAPI";

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

const sortOptions: SortOption[] = [
    {name: 'Most Popular', href: '#', current: true},
    {name: 'Best Rating', href: '#', current: false},
    {name: 'Newest', href: '#', current: false},
    {name: 'Price: Low to High', href: '#', current: false},
    {name: 'Price: High to Low', href: '#', current: false},
];

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
    // 모든 쿼리 파라미터를 객체 형태로 가져오기
    // const params = Object.fromEntries(searchParams.entries());
    // 모든 쿼리 파라미터를 [{ key, value }] 형태로 변환
    const paramsArray: Params[] = Array.from(searchParams.entries()).map(([key, value]) => ({
        key,
        value
    }));
    console.log('categoryId', categoryId);

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

    const [filterStates, setFilterStates] = useState<Record<string, FilterOption[]>>({
        category: filters[0].options,
        size: filters[1].options,
        color: filters[2].options,
    });

    const toggleFilter = (sectionId: string, value?: string) => {
        if (value) {
            setFilterStates((prev) => ({
                ...prev,
                [sectionId]: prev[sectionId].map(option =>
                    option.value === value ? {...option, checked: !option.checked} : option
                ),
            }));
        } else {
            setMobileFiltersOpen(!mobileFiltersOpen);
        }
    };
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
                row: 3,
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
            return lastPage.data.current + 1;
        },
        initialPageParam: 1,
        staleTime: 60 * 1000,
        retry: 0,
        refetchOnMount: false,
        refetchOnReconnect: false,
        refetchOnWindowFocus: false,
    });


    const {data: categories} = useQuery<DataResponse<Array<Category>>, Object, Array<Category>>({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: false,
        select: (data) => {
            // 데이터 가공 로직만 처리
            return data.data;
        }
    });

    const {data: category} = useQuery<DataResponse<Category>, Object, Category, [_1: string, _2: string]>({
        queryKey: ['category', categoryId],
        queryFn: getCategory,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        enabled : !!categoryId, //categoryId가 있을 때만 쿼리 요청
        select: useCallback((data: DataResponse<Category>) => {
            return data.data;
        }, []),
    });

    console.log('cccc', products);

    const {ref, inView} = useInView();

    useEffect(() => {

        const inViewFunc = async () => {
            await fetchNextPage();
        };
        if (inView && hasNextPage)
            inViewFunc();

    }, [inView]);

    if (isLoading) {
        return (
            <div>
                스켈레톤...
                {/*<Skeleton />*/}
            </div>
        );
    }

    if (isError) {
        return (
            <></>
        );
    }


    return (
        <div className="bg-white">
            <div>
                {/* Mobile filter dialog */}
                {/*{mobileFiltersOpen && (*/}
                {/*    <div className="fixed inset-0 z-40 flex">*/}
                {/*        <div className="fixed inset-0 bg-black bg-opacity-25"*/}
                {/*             onClick={() => setMobileFiltersOpen(false)}/>*/}
                {/*        <div*/}
                {/*            className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out">*/}
                {/*            <div className="flex items-center justify-between px-4">*/}
                {/*                <h2 className="text-lg font-medium text-gray-900">Filters</h2>*/}
                {/*                <button*/}
                {/*                    type="button"*/}
                {/*                    onClick={() => setMobileFiltersOpen(false)}*/}
                {/*                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"*/}
                {/*                >*/}
                {/*                    <span className="sr-only">Close menu</span>*/}
                {/*                    <XMarkIcon aria-hidden="true" className="h-6 w-6"/>*/}
                {/*                </button>*/}
                {/*            </div>*/}

                {/*            /!* Filters *!/*/}
                {/*            <form className="mt-4 border-t border-gray-200">*/}
                {/*                <h3 className="sr-only">Categories</h3>*/}
                {/*                <ul role="list" className="px-2 py-3 font-medium text-gray-900">*/}
                {/*                    {subCategories.map((category) => (*/}
                {/*                        <li key={category.name}>*/}
                {/*                            <a href={category.href} className="block px-2 py-3">*/}
                {/*                                {category.name}*/}
                {/*                            </a>*/}
                {/*                        </li>*/}
                {/*                    ))}*/}
                {/*                </ul>*/}

                {/*                {filters.map((section) => (*/}
                {/*                    <div key={section.id} className="border-t border-gray-200 px-4 py-6">*/}
                {/*                        <h3 className="-mx-2 -my-3 flow-root">*/}
                {/*                            <button*/}
                {/*                                type="button"*/}
                {/*                                onClick={() => toggleFilter(section.id)}*/}
                {/*                                className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"*/}
                {/*                            >*/}
                {/*                                <span className="font-medium text-gray-900">{section.name}</span>*/}
                {/*                                <span className="ml-6 flex items-center">*/}
                {/*                                    <PlusIcon className="h-5 w-5 group-open:hidden"/>*/}
                {/*                                    <MinusIcon className="h-5 w-5 hidden group-open:block"/>*/}
                {/*                                </span>*/}
                {/*                            </button>*/}
                {/*                        </h3>*/}
                {/*                        <div className="pt-6">*/}
                {/*                            <div className="space-y-6">*/}
                {/*                                {section.options.map((option) => (*/}
                {/*                                    <div key={option.value} className="flex items-center">*/}
                {/*                                        <input*/}
                {/*                                            checked={filterStates[section.id].find(o => o.value === option.value)?.checked}*/}
                {/*                                            id={`filter-${section.id}-${option.value}`}*/}
                {/*                                            name={`${section.id}[]`}*/}
                {/*                                            type="checkbox"*/}
                {/*                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"*/}
                {/*                                            onChange={() => toggleFilter(section.id, option.value)}*/}
                {/*                                        />*/}
                {/*                                        <label*/}
                {/*                                            htmlFor={`filter-${section.id}-${option.value}`}*/}
                {/*                                            className="ml-3 text-gray-500"*/}
                {/*                                        >*/}
                {/*                                            {option.label}*/}
                {/*                                        </label>*/}
                {/*                                    </div>*/}
                {/*                                ))}*/}
                {/*                            </div>*/}
                {/*                        </div>*/}
                {/*                    </div>*/}
                {/*                ))}*/}
                {/*            </form>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*)}*/}

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

                        <div className="flex items-center">
                            <button type="button" className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7">
                                <span className="sr-only">View grid</span>
                                <Squares2X2Icon aria-hidden="true" className="h-5 w-5"/>
                            </button>
                            <button
                                type="button"
                                onClick={() => toggleFilter('mobile')}
                                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                            >
                                <span className="sr-only">Filters</span>
                                <FunnelIcon aria-hidden="true" className="h-5 w-5"/>
                            </button>
                        </div>
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
                                        products?.pages[0].data.dtoList.length < 1 ?
                                            <div>상품이 없습니다.</div> : products?.pages.map((page, index) => (
                                                <Fragment key={index}>
                                                    {page?.data?.dtoList.map((product: Product) => (
                                                        <ProductCard key={product.pno} product={product}/>
                                                    ))}
                                                </Fragment>
                                            ))
                                    }


                                </div>
                                {isFetchingNextPage ? (<div>Skelton</div>) : (<div ref={ref}></div>)}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>


    );
};

export default ProductList;