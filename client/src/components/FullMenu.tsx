"use client";
import {useQuery} from "@tanstack/react-query";
import {DataResponse} from "@/interface/DataResponse";
import {Category} from "@/interface/Category";
import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";
import React, {Fragment, useState} from "react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image";

const FullMenu = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("category_id") || "";

    const {data: categories} = useQuery<DataResponse<Array<Category>>, Object, Array<Category>>({
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
        // const params = new URLSearchParams(searchParams.toString());
        // params.delete("category_id");
        // params.append("category_id", categoryId.toString());

        // router.push(`/list?${params.toString()}`);
        router.push(`/list?category_id=${categoryId}`);
    };


    const renderSubCategory = () => {
        const subCategories = categories?.find(ct => ct.cno === expandedRow)?.subCategories || [];
        const mainCategory = categories?.find(ct => ct.cno === expandedRow);
        return <div className="grid grid-cols-2 gap-8 m-10 w-full">
            <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 relative">
                    <Image
                        src="https://images.pexels.com/photos/17867705/pexels-photo-17867705/free-photo-of-crowd-of-hikers-on-the-mountain-ridge-at-dusk.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                        alt="image" width={600} height={600} className="w-full h-70 object-cover rounded-lg"/>
                    <div className='bg-white h-19 opacity-70 absolute w-full bottom-0 flex p-4 flex-col'>
                        <div>New Arrivals</div>
                        <div>Shop now</div>
                    </div>
                </div>
                <div className="relative">
                    <Image
                        src="https://images.pexels.com/photos/1021693/pexels-photo-1021693.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="image" width={600} height={600} className="w-full object-cover h-70 rounded-lg"/>
                    <div className='bg-white h-19 opacity-70 absolute w-full bottom-0 flex p-4 flex-col'>
                        <div>New Arrivals</div>
                        <div>Shop now</div>
                    </div>
                </div>
                <div className="relative">
                    <Image
                        src="https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800"
                        alt="image" width={600} height={600} className="w-full object-cover h-70 rounded-lg"/>
                    <div className='bg-white h-19 opacity-70 absolute w-full bottom-0 flex p-4 flex-col'>
                        <div>New Arrivals</div>
                        <div>Shop now</div>
                    </div>
                </div>
            </div>
            <div className="">
                <div className="font-medium text-base cursor-pointer">{mainCategory?.cname}</div>
                {renderSubResult(subCategories)}
            </div>
        </div>
    };

    const renderSubResult = (subCategories: Category[], depth: number = 0) => {
        return subCategories?.map((sub) => (
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

    // 메인 카테고리를 렌더링하는 함수
    const renderMainCategory = (categories: Category[], depth: number = 0) => {
        return categories.map((category) => (
            <Fragment key={category.cno}>
                <div className="flex items-center cursor-pointer px-3 gap-0.5 hover:bg-gray-100 hover:rounded-2xl mx-1.5 py-2.5" onClick={expandedRow === category.cno ? () => setExpandedRow(null) : () => setExpandedRow(category.cno)}>
                    <div className={category.cno.toString() === categoryId ? "text-ecom font-bold" : ""}>{category.cname}</div>
                        {category.subCategories && (
                            <div onClick={(e) => {
                                e.stopPropagation(); // 부모 onClick 이벤트 방지
                                setExpandedRow(category.cno)//현재 expand누른 카테고리 넘버
                            }}>
                                <ChevronDownIcon className="h-5 w-5 text-gray-400 "/>
                            </div>
                        )}
                </div>

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
            <div className="absolute left-0 w-full top-20 bg-gray-50 shadow z-1 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64 flex gap-25">
                {
                    expandedRow && renderSubCategory()
                }
            </div>
        </div>

    </div>;
};


export default FullMenu;