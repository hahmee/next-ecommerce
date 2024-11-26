import Slider from "@/components/Slider";
import React, {Suspense} from "react";
import {getCategories} from "@/api/adminAPI";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import Skeleton from "@/components/Skeleton/Skeleton";
import Categories from "@/components/Home/Main/Categories";
import MainProductList from "@/components/Admin/Product/MainProductList";

const HomePage = () => {

    const prefetchOptions = [
        {
            queryKey: ['categories'],
            queryFn: () => getCategories()
        },
        // {
        //     queryKey: ['new-products'],
        //     queryFn: () => getNewProducts()
        // }
    ];

    return (
        <div className="">
            <Slider/>
            <div className="mt-24">
                <h1 className="text-2xl px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 mb-3">
                    Categories
                </h1>
                <Suspense fallback={<Skeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <Categories/>
                    </PrefetchBoundary>
                </Suspense>
            </div>
            <div className="mt-24 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
               <h1 className="text-2xl">New Products</h1>
                <Suspense fallback={<Skeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <MainProductList/>
                    </PrefetchBoundary>
                </Suspense>
            </div>
        </div>
    )
};

export default HomePage