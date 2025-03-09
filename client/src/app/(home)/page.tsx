import Slider from "@/components/Home/Slider";
import React, {Suspense} from "react";
import {getCategories, getFeaturedProducts, getNewProducts} from "@/apis/adminAPI";
import {PrefetchBoundary} from "@/libs/PrefetchBoundary";
import Skeleton from "@/components/Skeleton/Skeleton";
import Categories from "@/components/Home/Main/Categories";
import MainProductList from "@/components/Admin/Product/MainProductList";
import MainInfo from "@/components/Admin/Product/MainInfo";
import Image from "next/image";
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
                <section className="py-10">
                    <div className="max-w-7xl mx-auto px-4">
                        {/* 헤더 영역 */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                Chosen by our experts
                            </h2>

                        </div>

                        {/* 제품 카드 그리드 */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {products.map((product) => {
                                // 첫 번째 이미지는 메인 이미지, 나머지 3개는 서브 이미지
                                const mainImage = product.images[0];
                                const subImages = product.images.slice(1);

                                return (
                                    <div
                                        key={product.id}
                                        className=""
                                    >
                                        {/* 상단: 이미지 영역 */}
                                        <div className="flex flex-col gap-2">
                                            {/* 메인 이미지 (큰 이미지) */}
                                            <div className="relative w-full h-48">
                                                <Image
                                                    src={mainImage}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                />
                                            </div>

                                            {/* 서브 이미지 (작은 이미지 3개) */}
                                            <div className="flex gap-2">
                                                {subImages.map((src, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="relative w-1/3 h-20 overflow-hidden rounded"
                                                    >
                                                        <Image
                                                            src={src}
                                                            alt={`${product.name}-sub-${idx}`}
                                                            fill
                                                            className="object-cover rounded-lg"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* 하단: 텍스트 정보 */}
                                        <div className="mt-4">
                                            <h3 className="text-lg font-semibold text-gray-800">
                                                {product.name}
                                            </h3>
                                            <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                <span>{product.colorInfo}</span>
                                                <span>
                      {product.rating} ★ ({product.reviewCount} reviews)
                    </span>
                                            </div>
                                            <div className="mt-2 text-green-600 font-semibold">
                                                ${product.price}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </div>

            <div className="mt-40 px-4">
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
