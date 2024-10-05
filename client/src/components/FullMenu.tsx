"use client";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Category} from "@/interface/Category";
import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";
import React, {Fragment, useEffect, useState} from "react";
import {ChevronDownIcon, ChevronUpIcon} from "@heroicons/react/20/solid";
import {useRouter, useSearchParams} from "next/navigation";
import exp from "node:constants";
import Image from "next/image";

const FullMenu = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category_id") || "";

    const {data: categories,} = useQuery<DataResponse<Array<Category>>, Object, Array<Category>>({
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

    const [expandedRow, setExpandedRow] = useState<number |null>(null);
    // // 행 클릭 시 확장 여부 토글

    const onClickCategory = (categoryId:number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("category_id");
        params.append("category_id", categoryId.toString());

        router.push(`/list?${params.toString()}`);
    };


    const renderSubCategory = () => {
        const subCategories = categories?.find(ct => ct.cno === expandedRow)?.subCategories || [];
        return renderSubResult(subCategories);
    };

    const renderSubResult = (subCategories: Category[], depth: number = 0) => {
        return subCategories?.map((sub) => (
            <div key={sub.cno} className="">
                <div className="flex items-center cursor-pointer justify-between"
                     style={{paddingLeft: `${depth * 20}px`}} onClick={() => onClickCategory(sub.cno)}>
                    <div className={sub.cno.toString() === categoryId ? "text-ecom font-bold" : ""}>{sub.cname}</div>
                </div>

                {sub.subCategories && (
                    renderSubResult(sub.subCategories, depth + 1)
                )}
            </div>
        ));
    }

    // 재귀적으로 하위 카테고리를 렌더링하는 함수
    const renderMainCategory = (categories: Category[], depth: number = 0) => {
        return categories.map((category) => (
            <Fragment key={category.cno}>
                <li className="flex items-center cursor-pointer px-2 gap-0.5"
                    onClick={expandedRow === category.cno ? () => setExpandedRow(null) : () => setExpandedRow(category.cno)}>
                    <div
                        className={category.cno.toString() === categoryId ? "text-ecom font-bold" : ""}>{category.cname}</div>
                    {category.subCategories && (
                        <div onClick={(e) => {
                            e.stopPropagation(); // 부모 onClick 이벤트 방지
                            // toggleRow(category.cno); // toggleRow 함수 호출

                            setExpandedRow(category.cno)//현재 expand누른 카테고리 넘버
                        }}>
                                <ChevronDownIcon className="h-5 w-5 text-gray-400"/>
                        </div>
                    )}
                </li>

            </Fragment>
        ));
    };

    return <div className="hidden xl:flex gap-4">
        {/*모달 바깥 클릭 */}
        <div className={`z-1 fixed w-full overflow-hidden h-screen top-0 left-0 ${expandedRow === null && "hidden"}`} onClick={() => setExpandedRow(null)}></div>

        <div onClick={(e) => e.stopPropagation()}>
            <ul role="list" className="flex items-center justify-center w-full text-sm font-medium text-gray-900">
                {categories && renderMainCategory(categories)}
            </ul>

            {/*Drop down*/}
            <div
                className="absolute left-0 w-full top-20 bg-gray-50 shadow z-1 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex gap-10">
                {
                    expandedRow && renderSubCategory()
                }
                {/*<div className="aspect-h-1 aspect-w-1 overflow-hidden rounded-lg bg-gray-100 group-hover:opacity-75">*/}
                {/*    <Image src="https://images.pexels.com/photos/17867705/pexels-photo-17867705/free-photo-of-crowd-of-hikers-on-the-mountain-ridge-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"*/}
                {/*           alt="Models sitting back to back, wearing Basic Tee in black and bone."*/}
                {/*           className="object-cover object-center" width={100} height={100}/>*/}
                {/*</div>*/}

            </div>
        </div>

    </div>;
};


export default FullMenu;