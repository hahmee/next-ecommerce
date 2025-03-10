"use client";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Category} from "@/interface/Category";
import Image from "next/image";
import {getCategories} from "@/apis/adminAPI";
import Skeleton from "@/components/Skeleton/Skeleton";
import React from "react";
import {useRouter} from "next/navigation";
import Link from "next/link";

const Categories = () => {
    const router = useRouter();

    //카테고리 가져오기
    const {
        isFetching,
        data: categories,
        isLoading
    } = useQuery<DataResponse<Array<Category>>, Object, Array<Category>>({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        throwOnError: true, // 에러 발생 시 자동으로 에러 경계로 전달
        select: (data) => {
            // 데이터 가공 로직만 처리
            return data.data;
        }
    });

    if(!categories) {
        return <Skeleton/>; // 로딩 상태 표시
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4">
                {/* 그리드 레이아웃: 작은 화면에서 1~2칸, 중간/큰 화면에서 3칸 이상 */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                    {categories?.map((category, idx) => (
                        <div
                            key={category.cno}
                            onClick={() => router.push(`/list?category_id=${category.cno}`)}
                            className="relative bg-white rounded-xl shadow-md p-6 cursor-pointer
                           hover:shadow-lg transition-transform transform hover:scale-[1.02] py-8"
                        >
                            {/* 상단 영역: Manufacturer / 제품 개수 */}
                            <div className="flex justify-between items-center mb-9">
                                <Image
                                    src={category.uploadFileName||""}
                                    alt="image"
                                    width={100}
                                    height={100}
                                    className="pointer-events-none select-none rounded-full w-20 h-20 object-cover"
                                />
                                {/* category에 제품 개수를 담아두었다고 가정 (없으면 0 표시) */}
                                <span className="text-sm text-gray-500">
                                 products
                                </span>
                            </div>

                            {/* 중앙: 카테고리명 */}
                            <span className="text-sm text-gray-500">Manufacturer</span>

                            <h3 className="text-2xl font-semibold text-gray-800 mb-12">
                                {category.cname}
                            </h3>

                            {/* 하단: See Collection -> */}
                            <Link href={`/list?category_id=${category.cno}`}>
                                <span className="text-sm text-black-600 font-medium hover:text-primary-700">
                                  See Collection &rarr;
                                </span>
                            </Link>


                        </div>
                    ))}
                </div>
            </div>
        </section>
    );

}
export default Categories;