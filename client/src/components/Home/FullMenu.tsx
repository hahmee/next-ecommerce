"use client";
import { useQuery } from "@tanstack/react-query";
import { DataResponse } from "@/interface/DataResponse";
import { Category } from "@/interface/Category";
import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { Member } from "@/interface/Member";
import { getCategories } from "@/apis/adminAPI";

const FullMenu = ({ member }: { member: Member }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category_id") || "";
    const [hoverCategoryId, setHoverCategoryId] = useState<number | null>(null);

    const { data: categories } = useQuery<DataResponse<Array<Category>>, Object, Array<Category>>({
        queryKey: ["categories"],
        queryFn: () => getCategories(),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
        enabled: !!member,
    });

    const onClickCategory = (cno: number) => {
        router.push(`/list?category_id=${cno}`);
    };

    const renderSubResult = (subCategories: Category[], depth: number = 0) => {
        return subCategories?.map((sub) => (
            <div key={sub.cno} className="m-2">
                <div
                    className="flex items-center cursor-pointer justify-between p-2 hover:bg-gray-100 hover:rounded-2xl "
                    onClick={() => onClickCategory(sub.cno)}
                >
                    <div className="text-sm font-medium text-gray-900">{sub.cname}</div>
                </div>
                {sub.subCategories && renderSubResult(sub.subCategories, depth + 1)}
            </div>
        ));
    };

    return (
        <div className="hidden md:flex gap-4 relative">
            <div onClick={(e) => e.stopPropagation()}>
                <div role="list" className="flex items-center justify-center w-full text-sm font-medium text-gray-900">
                    {categories &&
                        categories.map((category) => (
                            <div
                                key={category.cno}
                                className="relative"
                            >
                                <div
                                    className="flex items-center cursor-pointer px-3 gap-0.5 hover:bg-gray-100 hover:rounded-2xl mx-1.5 py-2.5"
                                    onClick={() => router.push(`/list?category_id=${category.cno}`)}
                                    onMouseEnter={() => setHoverCategoryId(category.cno)} // Hover 시 상태 변경
                                    onMouseLeave={() => setHoverCategoryId(null)} // Hover 해제 시 상태 초기화
                                >
                                    <div
                                        className={
                                            category.cno.toString() === categoryId
                                                ? "text-ecom font-bold text-base"
                                                : "font-medium text-gray-900 text-base"
                                        }
                                    >
                                        {category.cname}
                                    </div>
                                    {category.subCategories && <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
                                </div>

                                {/*  hoverCategoryId가 현재 카테고리일 때만 하위 카테고리 표시 */}
                                {hoverCategoryId === category.cno && category.subCategories && (
                                    <div className="absolute w-56 rounded-lg bg-white shadow-lg top-10 z-20 transition-all duration-300 opacity-100 scale-100"
                                         onMouseEnter={() => setHoverCategoryId(category.cno)} // Hover 시 상태 변경
                                         onMouseLeave={() => setHoverCategoryId(null)} // Hover 해제 시 상태 초기화
                                    >
                                        {renderSubResult(category.subCategories || [])}
                                    </div>
                                )}
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default FullMenu;
