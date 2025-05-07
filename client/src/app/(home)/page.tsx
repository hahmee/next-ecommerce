import Slider from "@/components/Home/Slider";
import React, {Suspense} from "react";
import {getCategories, getExpertProducts, getFeaturedProducts, getNewProducts} from "@/apis/adminAPI";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import Skeleton from "@/components/Skeleton/Skeleton";
import Categories from "@/components/Home/Main/Categories";
import MainProductList from "@/components/Admin/Product/MainProductList";
import MainInfo from "@/components/Admin/Product/MainInfo";
import ExpertList from "@/components/Admin/Product/ExpertList";
import ExpertListSkeleton from "@/components/Skeleton/ExpertListSkeleton";
import ErrorHandlingWrapper from "@/components/ErrorHandlingWrapper";
// 예시 데이터
const products = [
    {
        id: 1,
        name: "Suede Bomber Jacket",
        images: [
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",

        ],
        colorInfo: "Orange",
        rating: 4.8,
        reviewCount: 265,
        price: 80,
    },
    {
        id: 2,
        name: "Downtown Pet Tote",
        images: [
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",

        ],
        colorInfo: "Black and Orange",
        rating: 4.4,
        reviewCount: 298,
        price: 58,
    },
    {
        id: 3,
        name: "Coder Leather Sneakers",
        images: [
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",
            "https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800",

        ],
        colorInfo: "3 Sizes Available",
        rating: 4.6,
        reviewCount: 312,
        price: 60,
    },
];
const HomePage = () => {

    const prefetchOptions = [
        {
            queryKey: ['categories'],
            queryFn: () => getCategories()
        },
        {
            queryKey: ['expert-products'],
            queryFn: () => getExpertProducts()
        },
        {
            queryKey: ['new-products'],
            queryFn: () => getNewProducts()
        },
        {
            queryKey: ['featured-products'],
            queryFn: () => getFeaturedProducts()
        },
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
                        <ErrorHandlingWrapper>
                            <Categories/>
                        </ErrorHandlingWrapper>
                    </PrefetchBoundary>
                </Suspense>
            </div>

            <div className="mt-40 px-4">
                <Suspense fallback={<ExpertListSkeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <ErrorHandlingWrapper>
                            <ExpertList/>
                        </ErrorHandlingWrapper>
                    </PrefetchBoundary>
                </Suspense>
            </div>

            <div className="mt-40 px-4">
                <h1 className="text-2xl font-bold text-gray-600 text-center">New Products</h1>
                <div className="w-30 h-1.5 bg-ecomLow text-center rounded m-auto mt-4"></div>
                <Suspense fallback={<Skeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <ErrorHandlingWrapper>
                            <MainProductList type="new"/>
                        </ErrorHandlingWrapper>
                    </PrefetchBoundary>
                </Suspense>
            </div>

            <div className="mt-24 px-4">
                <h1 className="text-2xl font-bold text-gray-600 text-center">Featured Products</h1>
                <div className="w-30 h-1.5 bg-ecomLow text-center rounded m-auto mt-4"></div>
                <Suspense fallback={<Skeleton/>}>
                    <PrefetchBoundary prefetchOptions={prefetchOptions}>
                        <ErrorHandlingWrapper>
                            <MainProductList type="featured"/>
                        </ErrorHandlingWrapper>
                    </PrefetchBoundary>
                </Suspense>
            </div>

            <MainInfo/>
        </div>
    );
};

export default HomePage
