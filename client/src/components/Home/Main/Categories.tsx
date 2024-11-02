"use client";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Category} from "@/interface/Category";
import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";
import Link from "next/link";
import Image from "next/image";

const Categories = () => {
    //카테고리 가져오기
    const { isFetched:ctIsFetched, isFetching:ctIsFetching, data:categories, error:ctError, isError:ctIsError} = useQuery<DataResponse<Array<Category>>, Object, Array<Category>>({
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

    return <div className="px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 md:gap-8">
            {categories?.map((ct) => (
                <Link
                    href={`/list?category_id=${ct.cno}`}
                    className="flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 xl:w-1/6 py-6"
                    key={ct.cno}
                >
                    <div className="relative bg-slate-100 w-full h-65">
                        <Image
                            src={ct.uploadFileName || ""}
                            alt="categoryImage"
                            width={500}
                            height={500}
                            sizes="20vw"
                            className="object-cover w-full h-full"
                        />
                    </div>
                    <h1 className="mt-4 font-normal  tracking-wide">
                        {ct.cname}
                    </h1>
                </Link>
            ))}
        </div>
    </div>
        ;
}
export default Categories;