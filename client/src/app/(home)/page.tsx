import Slider from "@/components/Home/Slider";
import React, {Suspense} from "react";
import {getCategories, getFeaturedProducts, getNewProducts} from "@/apis/adminAPI";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import Skeleton from "@/components/Skeleton/Skeleton";
import Categories from "@/components/Home/Main/Categories";
import MainProductList from "@/components/Admin/Product/MainProductList";
import MainInfo from "@/components/Admin/Product/MainInfo";

const HomePage = () => {

    const prefetchOptions = [
        {
            queryKey: ['categories'],
            queryFn: () => getCategories()
        },
        {
            queryKey: ['new-products'],
            queryFn: () => getNewProducts()
        },
        {
            queryKey: ['featured-products'],
            queryFn: () => getFeaturedProducts()
        }
    ];

    return (
        <div>
            <Slider/>
            <div className="mt-24 bg-[#F9F9F9] m-auto py-10">
                <h1 className="text-4xl font-bold text-gray-600 text-center py-10 px-4.5">
                    Categories
                </h1>
                <Suspense fallback={<Skeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <Categories/>
                    </PrefetchBoundary>
                </Suspense>
            </div>
            <div className="mt-24 px-4">
                <h1 className="text-2xl font-bold text-gray-600 text-center">New Products</h1>
                <div className="w-30 h-1.5 bg-ecomLow text-center rounded m-auto mt-4"></div>
                <Suspense fallback={<Skeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <MainProductList type="new"/>
                    </PrefetchBoundary>
                </Suspense>
            </div>

            <div className="mt-24 px-4">
                <h1 className="text-2xl font-bold text-gray-600 text-center">Featured Products</h1>
                <div className="w-30 h-1.5 bg-ecomLow text-center rounded m-auto mt-4"></div>
                <Suspense fallback={<Skeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <MainProductList type="featured"/>
                    </PrefetchBoundary>
                </Suspense>
            </div>

            <MainInfo/>
        </div>
    );
};

export default HomePage
