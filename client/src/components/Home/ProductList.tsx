"use client";

import {XMarkIcon} from "@heroicons/react/24/outline";
import {FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon} from "@heroicons/react/20/solid";
import React, {Fragment, useEffect, useState} from "react";
import {getProductList} from "@/app/(home)/list/_lib/getProductList";
import {useInView} from "react-intersection-observer";
import {useInfiniteQuery} from "@tanstack/react-query";
import ProductCard from "@/components/Home/ProductCard";
import {Product} from "@/interface/Product";

type SortOption = {
    name: string;
    href: string;
    current: boolean;
};

type SubCategory = {
    name: string;
    href: string;
};

type FilterOption = {
    value: string;
    label: string;
    checked: boolean;
};

type FilterSection = {
    id: string;
    name: string;
    options: FilterOption[];
};

const sortOptions: SortOption[] = [
    {name: 'Most Popular', href: '#', current: true},
    {name: 'Best Rating', href: '#', current: false},
    {name: 'Newest', href: '#', current: false},
    {name: 'Price: Low to High', href: '#', current: false},
    {name: 'Price: High to Low', href: '#', current: false},
];

const subCategories: SubCategory[] = [
    {name: 'Totes', href: '#'},
    {name: 'Backpacks', href: '#'},
    {name: 'Travel Bags', href: '#'},
    {name: 'Hip Bags', href: '#'},
    {name: 'Laptop Sleeves', href: '#'},
];

const filters: FilterSection[] = [
    {
        id: 'color',
        name: 'Color',
        options: [
            {value: 'white', label: 'White', checked: false},
            {value: 'beige', label: 'Beige', checked: false},
            {value: 'blue', label: 'Blue', checked: true},
            {value: 'brown', label: 'Brown', checked: false},
            {value: 'green', label: 'Green', checked: false},
            {value: 'purple', label: 'Purple', checked: false},
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
        id: 'size',
        name: 'Size',
        options: [
            {value: '2l', label: '2L', checked: false},
            {value: '6l', label: '6L', checked: false},
            {value: '12l', label: '12L', checked: false},
            {value: '18l', label: '18L', checked: false},
            {value: '20l', label: '20L', checked: false},
            {value: '40l', label: '40L', checked: true},
        ],
    },
];

export const ROWS_PER_PAGE = 3; // 한 페이지당 불러올 상품개수

const ProductList = ({categoryId}: {categoryId:string}) => {

    const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
    const [filterStates, setFilterStates] = useState<Record<string, FilterOption[]>>({
        color: filters[0].options,
        category: filters[1].options,
        size: filters[2].options,
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

    const {data: products, hasNextPage, isFetching, isLoading, fetchNextPage, isError, isFetchingNextPage, status,} = useInfiniteQuery({
        queryKey: ['products',categoryId],
        queryFn: ({pageParam=1, meta}) => {
            return getProductList({queryKey: ['products'], page: pageParam, row: ROWS_PER_PAGE, categoryId:categoryId });
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

    const {ref, inView} = useInView();

    useEffect(() => {

        const inViewFunc = async () => {
            await fetchNextPage();
        };
        if(inView && hasNextPage)
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
                {mobileFiltersOpen && (
                    <div className="fixed inset-0 z-40 flex">
                        <div className="fixed inset-0 bg-black bg-opacity-25"
                             onClick={() => setMobileFiltersOpen(false)}/>
                        <div
                            className="relative ml-auto flex h-full w-full max-w-xs transform flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl transition duration-300 ease-in-out">
                            <div className="flex items-center justify-between px-4">
                                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                                <button
                                    type="button"
                                    onClick={() => setMobileFiltersOpen(false)}
                                    className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon aria-hidden="true" className="h-6 w-6"/>
                                </button>
                            </div>

                            {/* Filters */}
                            <form className="mt-4 border-t border-gray-200">
                                <h3 className="sr-only">Categories</h3>
                                <ul role="list" className="px-2 py-3 font-medium text-gray-900">
                                    {subCategories.map((category) => (
                                        <li key={category.name}>
                                            <a href={category.href} className="block px-2 py-3">
                                                {category.name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>

                                {filters.map((section) => (
                                    <div key={section.id} className="border-t border-gray-200 px-4 py-6">
                                        <h3 className="-mx-2 -my-3 flow-root">
                                            <button
                                                type="button"
                                                onClick={() => toggleFilter(section.id)}
                                                className="group flex w-full items-center justify-between bg-white px-2 py-3 text-gray-400 hover:text-gray-500"
                                            >
                                                <span className="font-medium text-gray-900">{section.name}</span>
                                                <span className="ml-6 flex items-center">
                                                    <PlusIcon className="h-5 w-5 group-open:hidden"/>
                                                    <MinusIcon className="h-5 w-5 hidden group-open:block"/>
                                                </span>
                                            </button>
                                        </h3>
                                        <div className="pt-6">
                                            <div className="space-y-6">
                                                {section.options.map((option) => (
                                                    <div key={option.value} className="flex items-center">
                                                        <input
                                                            checked={filterStates[section.id].find(o => o.value === option.value)?.checked}
                                                            id={`filter-${section.id}-${option.value}`}
                                                            name={`${section.id}[]`}
                                                            type="checkbox"
                                                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                            onChange={() => toggleFilter(section.id, option.value)}
                                                        />
                                                        <label
                                                            htmlFor={`filter-${section.id}-${option.value}`}
                                                            className="ml-3 text-gray-500"
                                                        >
                                                            {option.label}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </form>
                        </div>
                    </div>
                )}

                <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-slate-900">Woman collection</h1>
                            <p className="text-sm md:text-base text-slate-500 my-3.5">
                                We not only help you design exceptional products, but also make it easy for you<br></br>
                                to share your designs with more like-minded people.
                            </p>
                        </div>
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
                                <h3 className="sr-only">Categories</h3>
                                <ul role="list"
                                    className="space-y-4 border-b border-gray-200 pb-6 text-sm font-medium text-gray-900">
                                    {subCategories.map((category) => (
                                        <li key={category.name}>
                                            <a href={category.href}>{category.name}</a>
                                        </li>
                                    ))}
                                </ul>

                                {filters.map((section) => (
                                    <div key={section.id} className="border-b border-gray-200 py-6">
                                        <h3 className="flex justify-between">
                                            <span className="font-medium text-gray-900">{section.name}</span>
                                        </h3>
                                        <div className="space-y-4 pt-6">
                                            {section.options.map((option) => (
                                                <div key={option.value} className="flex items-center">
                                                    <input
                                                        checked={filterStates[section.id].find(o => o.value === option.value)?.checked}
                                                        id={`filter-${section.id}-${option.value}`}
                                                        name={`${section.id}[]`}
                                                        type="checkbox"
                                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                                        onChange={() => toggleFilter(section.id, option.value)}
                                                    />
                                                    <label
                                                        htmlFor={`filter-${section.id}-${option.value}`}
                                                        className="ml-3 text-gray-500"
                                                    >
                                                        {option.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </form>

                            {/* Product Grid */}
                            <div className="lg:col-span-3">
                                <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                                    {products?.pages.map((page, index) => (
                                        <Fragment key={index}>
                                            {page?.data?.dtoList.map((product: Product) => (
                                                <ProductCard key={product.pno} product={product} />
                                            ))}
                                        </Fragment>
                                    ))}
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