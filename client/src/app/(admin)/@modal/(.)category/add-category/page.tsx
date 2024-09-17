"use client";

import AdminModal from "@/components/Admin/AdminModal";
import React, {useState} from "react";
import {useRouter} from "next/navigation";
import {Category, initialCategories} from "@/components/Tables/CategoryTable";
import {Simulate} from "react-dom/test-utils";
import CategoryBreadcrumb from "@/components/Admin/CategoryBreadcrumb";

export default function CategoryModal() {
    const router = useRouter();
    // const [newCategory, setNewCategory] = useState({ name: "SHOP", description: "", permission: "모든사용자" });
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
    const [clickedCt, setClickedCt] = useState<Category>(initialCategories[0]);

    // 카테고리를 평탄화하여 선택 목록에 사용
    const flattenCategories = (categories: Category[], depth: number = 0, prefix: string = ""): { id: number; name: string, category: Category }[] => {
        return categories.reduce<{ id: number; name: string; category:Category }[]>((acc, category) => {
            acc.push({ id: category.id, name: `${prefix}${category.name}`, category });

            if (category.subCategories && category.subCategories.length > 0) {
                acc = acc.concat(flattenCategories(category.subCategories, depth + 1, `${prefix} -- `));
            }
            return acc;
        }, []);
    };

    console.log(flattenCategories(categories));
    const closeModal =() => {
        router.push(`/admin/category`);
    }

    const clickCategory = (category: Category) => {
        // console.log('id', id);
        //재귀로 subCategories까지 id 찾기
        console.log('category', category);
        setClickedCt(category || initialCategories[0]);
    };

    //여기에서 모달 구현
    return (

        <AdminModal clickModal={closeModal} modalTitle={"새 카테고리 추가"}>
            <div className="p-4 md:p-5 space-y-4">
                <div className="p-2 flex">

                    {/* Left side: Category List */}
                    <div className="w-1/3 border-r pr-1">
                        {/*<h2 className="text-lg font-semibold mb-4">새 카테고리</h2>*/}
                        <ul className="space-y-2">
                            {flattenCategories(categories).map((cat) => (
                                <li key={cat.id} className={`pl-1 flex ${cat.id === clickedCt.id && 'bg-violet-500 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300'}`} onClick={()=>clickCategory(cat.category)} >
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"/>
                                        </svg>
                                    </span>
                                    <span className="cursor-pointer">
                                        {cat.name}
                                    </span>
                                </li>
                            ))}
                        </ul>

                    </div>

                    {/* Right side: Category Details */}
                    <div className="w-2/3 pl-6">
                        {/*BreadCrumps..*/}
                        <div>
                            <CategoryBreadcrumb pageName="Products" clickedCt={clickedCt} categories={categories}/>
                        </div>
                        <input
                            type="text"
                            placeholder="새 카테고리 이름을 입력해주세요."
                            // value={clickedCt.name}
                            onChange={(e) => setClickedCt({...clickedCt, name: e.target.value})}
                            className="mb-3 w-full p-2 border border-gray-300 rounded"
                        />
                        <textarea
                            placeholder="새 카테고리 설명을 입력해주세요."
                            // value={clickedCt.description}
                            onChange={(e) => setClickedCt({...clickedCt, description: e.target.value})}
                            className="mb-3 w-full p-2 border border-gray-300 rounded"
                        />
                        <select
                            className="mb-4 w-full p-2 border border-gray-300 rounded"
                            onChange={(e) => setParentCategoryId(e.target.value ? parseInt(e.target.value) : null)}
                        >
                            <option value="">사용중</option>
                            <option value="all">사용 중지</option>
                        </select>
                    </div>
                </div>
            </div>
        </AdminModal>
    );
}