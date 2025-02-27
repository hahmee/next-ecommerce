"use client";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Category} from "@/interface/Category";
import Image from "next/image";
import {getCategories} from "@/apis/adminAPI";
import Skeleton from "@/components/Skeleton/Skeleton";
import React from "react";
import {useRouter} from "next/navigation";

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
        <section className="py-16">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                    {categories?.map((category) => (
                        <div
                            onClick={()=>router.push(`/list?category_id=${category.cno}`)}
                            key={category.cno}
                            className="relative bg-white shadow-md rounded p-4 hover:scale-105 transform transition"
                        >
                            <Image
                                src={category.uploadFileName || "/images/mall/no_image.png"}
                                alt='image_category'
                                width={300}
                                height={300}
                                className="rounded object-cover w-full h-60"
                            />
                            <h3 className="text-lg font-medium mt-2 text-center">
                                {category.cname}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
export default Categories;