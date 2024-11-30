"use client";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Category} from "@/interface/Category";
import Link from "next/link";
import Image from "next/image";
import {getCategories} from "@/api/adminAPI";
import Skeleton from "@/components/Skeleton/Skeleton";

const Categories = () => {
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

    if (isLoading || isFetching) {
        return <Skeleton/>; // 로딩 상태 표시
    }

    return <div className="px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 justify-center md:gap-8 items-center ">
            {categories?.map((ct) => (
                <Link
                    href={`/list?category_id=${ct.cno}`}
                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 py-6"
                    key={ct.cno}
                >
                    <div>
                        <div className="relative bg-slate-100 w-30 h-30">
                            <Image
                                src={ct.uploadFileName || "https://via.placeholder.com/640x480"}
                                alt="categoryImage"
                                width={500}
                                height={500}
                                sizes="20vw"
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <h1 className="mt-4 font-medium text-gray-800 tracking-wide">
                            {ct.cname}
                        </h1>
                    </div>
                </Link>
            ))}
        </div>
    </div>
        ;
}
export default Categories;