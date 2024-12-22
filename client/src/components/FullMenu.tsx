"use client";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Category} from "@/interface/Category";
import React, {Fragment, useState} from "react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";
import {Member} from "@/interface/Member";
import {getCategories} from "@/api/adminAPI";

const FullMenu = ({member}: {member: Member}) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category_id") || "";

    const {data: categories} = useQuery<DataResponse<Array<Category>>, Object, Array<Category>>({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
        enabled: !!member, // member 존재할 때만 실행
        select: (data) => {
            // 데이터 가공 로직만 처리
            return data.data;
        }
    });

    const [expandedRow, setExpandedRow] = useState<number |null>(null);
    // 행 클릭 시 확장 여부 토글

    const onClickCategory = (categoryId:number) => {
        router.push(`/list?category_id=${categoryId}`);
        //닫기
        setExpandedRow(null); // 메뉴 닫기

    };

    const renderSubResult = (subCategories: Category[], depth: number = 0) => {
        return  subCategories?.map((sub) => (
            <div key={sub.cno} className="m-4">
                <div className="flex items-center cursor-pointer justify-between" onClick={() => onClickCategory(sub.cno)}>
                    <div className="text-sm font-medium text-gray-900">{sub.cname}</div>
                </div>
                {sub.subCategories && (
                    renderSubResult(sub.subCategories, depth + 1)
                )}
            </div>
        ));
    }

    return <div className="hidden xl:flex gap-4 relative">
        {/*모달 바깥 클릭 */}
        <div className={`z-1 fixed w-full overflow-hidden h-screen top-0 left-0 ${expandedRow === null && "hidden"}`}
             onClick={() => setExpandedRow(null)}></div>

        <div onClick={(e) => e.stopPropagation()}>
            <div role="list" className="flex items-center justify-center w-full text-sm font-medium text-gray-900">
                {
                    categories && categories.map((category) => (
                        <Fragment key={category.cno}>
                            <div
                                className="relative flex items-center cursor-pointer px-3 gap-0.5 hover:bg-gray-100 hover:rounded-2xl mx-1.5 py-2.5"
                                onClick={expandedRow === category.cno ? () => setExpandedRow(null) : () => setExpandedRow(category.cno)}>
                                <div className={category.cno.toString() === categoryId ? "text-ecom font-bold text-base" : "font-medium text-gray-900 text-base"}>{category.cname}</div>
                                {category.subCategories && (
                                    <>
                                        <div onClick={(e) => {
                                            e.stopPropagation(); // 부모 onClick 이벤트 방지
                                            setExpandedRow(category.cno)//현재 expand누른 카테고리 넘버
                                        }}>
                                            <ChevronDownIcon className="h-5 w-5 text-gray-400"/>
                                        </div>
                                        <div className={`absolute w-56 rounded-lg bg-white shadow-lg top-12 z-20 transition-all duration-300 ${expandedRow===category.cno ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}>
                                            { expandedRow===category.cno && renderSubResult(category.subCategories || [])}
                                        </div>
                                    </>
                                )}

                            </div>
                        </Fragment>))
                }

            </div>


        </div>

    </div>;
};


export default FullMenu;