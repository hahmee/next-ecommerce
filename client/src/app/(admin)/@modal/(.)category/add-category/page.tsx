"use client";

import AdminModal from "@/components/Admin/AdminModal";
import React, {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import {Category, initialCategories} from "@/components/Tables/CategoryTable";
import CategoryBreadcrumb from "@/components/Admin/CategoryBreadcrumb";

export default function CategoryModal() {
    const router = useRouter();
    const [newCategory, setNewCategory] = useState({ id: null, name: "", description: "" });
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
    const [clickedCt, setClickedCt] = useState<Category | null>(null);
    const [isInputField, setIsInputField] = useState(false);
    const [editMode, setEditMode] = useState(false); // 수정 모드 상태 추가

    // 카테고리를 평탄화하여 선택 목록에 사용
    const flattenCategories = (categories: Category[], depth: number = 0, prefix: string = ""): {
        id: number;
        name: string,
        category: Category,
        depth: number;
    }[] => {
        return categories.reduce<{ id: number; name: string; category: Category, depth: number }[]>((acc, category) => {
            acc.push({ id: category.id, name: `${prefix}${category.name}`, category, depth });

            if (category.subCategories && category.subCategories.length > 0) {
                acc = acc.concat(flattenCategories(category.subCategories, depth + 1, `${prefix}`));
            }
            return acc;
        }, []);
    };

    const [newCategoryId, setNewCategoryId] = useState<number>(flattenCategories(categories).length + 2);

    // 특정 카테고리를 찾아 서브 카테고리를 추가하는 함수
    const addSubCategory = (categories: Category[], parentId: number, newCategory: Category): Category[] => {
        return categories.map(category => {
            if (category.id === parentId) {
                return {
                    ...category,
                    subCategories: category.subCategories
                        ? [...category.subCategories, newCategory]
                        : [newCategory],
                };
            }
            if (category.subCategories) {
                return {
                    ...category,
                    subCategories: addSubCategory(category.subCategories, parentId, newCategory),
                };
            }
            return category;
        });
    };

    // 카테고리 추가 함수
    const addNewCategory = () => {
        if (newCategory.name.trim() === "" || newCategory.description.trim() === "") {
            alert("카테고리명과 설명을 입력해주세요.");
            return;
        }

        const newCategoryObj: Category = {
            id: newCategoryId, // 유니크한 ID
            name: newCategory.name,
            description: newCategory.description,
            subCategories: [],
        };

        if (parentCategoryId === null) {
            setCategories([...categories, newCategoryObj]); // 최상위 카테고리로 추가
        } else {
            const updatedCategories = addSubCategory(categories, parentCategoryId, newCategoryObj);
            setCategories(updatedCategories); // 서브 카테고리로 추가
        }

        setNewCategoryId(prev => prev + 1);
        setNewCategory({ id: null, name: "", description: "" });
    };

    // 카테고리 수정 함수
    const editCategory = () => {
        if (clickedCt?.name.trim() === "" || clickedCt?.description.trim() === "") {
            alert("카테고리명과 설명을 입력해주세요.");
            return;
        }

        const updatedCategories = categories.map(category => {
            if (category.id === clickedCt?.id) {
                return { ...clickedCt }; // 선택된 카테고리 업데이트
            }
            if (category.subCategories) {
                return {
                    ...category,
                    subCategories: category.subCategories.map(sub => sub.id === clickedCt?.id ? clickedCt : sub),
                };
            }
            return category;
        });

        setCategories(updatedCategories);
        setNewCategory({ id: null, name: "", description: "" });
    };

    const closeModal = () => {
        router.push(`/admin/category`);
    };

    const clickCategory = (category: Category) => {
        setClickedCt(category);
        setParentCategoryId(category.id);
        setIsInputField(true);
        // setEditMode(true);
    };

    const addRootCateogry =() => {

        setIsInputField(true);
        setEditMode(false);
    }

    const handleAddCategory = () => {
        if (newCategory.name.trim() === "" || newCategory.description.trim() === "") {
            alert("카테고리명과 설명을 입력해주세요.");
            return;
        }

        const newCategoryObj: Category = {
            id: newCategoryId,
            name: newCategory.name,
            description: newCategory.description,
            subCategories: [],
        };

        if (parentCategoryId === null) {
            setCategories([...categories, newCategoryObj]);
        } else {
            const updatedCategories = addSubCategory(categories, parentCategoryId, newCategoryObj);
            setCategories(updatedCategories);
        }

        setNewCategory({ id: null, name: "", description: "" });
        setParentCategoryId(null);
        setNewCategoryId(prev => prev + 1);
    };

    const handleEditCategory = () => {
        if (clickedCt?.name.trim() === "" || clickedCt?.description.trim() === "") {
            alert("카테고리명과 설명을 입력해주세요.");
            return;
        }

        const updatedCategories = categories.map(cat =>
            cat.id === clickedCt?.id
                ? { ...cat, name: clickedCt.name, description: clickedCt.description }
                : cat
        );

        console.log('updatedCategories',updatedCategories)
        setCategories(updatedCategories);
        setEditMode(false);
        setNewCategory({ id: null, name: "", description: "" });
    };
    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log('editMode',editMode)
        editMode ? handleEditCategory() : handleAddCategory();
    };

    // 모달 구현
    return (
        <AdminModal clickModal={closeModal} modalTitle={"카테고리 관리"}>
            <div className="p-4 md:p-5 space-y-4">

                <div className="p-2 flex">
                    {/* Left side: Category List */}
                    <div className="w-1/3 border-r pr-1">
                        <ul className="space-y-2">
                            <li className={`pl-1 flex items-center`} onClick={addRootCateogry}>
                                <span className="pl-2">루트 카테고리 추가</span>
                                {/* Add button */}
                                {/*<span onClick={addNewCategory}>*/}
                                {/*            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"*/}
                                {/*                 strokeWidth={1.5} stroke="currentColor" className="size-5">*/}
                                {/*                <path strokeLinecap="round" strokeLinejoin="round"*/}
                                {/*                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>*/}
                                {/*            </svg>*/}
                                {/*        </span>*/}

                            </li>
                            {flattenCategories(categories).map((cat) => (
                                <li key={cat.id}
                                    className={`pl-1 flex items-center ${cat.id === clickedCt?.id && 'bg-violet-500 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300'}`}
                                    onClick={() => clickCategory(cat.category)}>
                                    <span>
                                        {cat.depth === 0 && (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"/>
                                            </svg>
                                        )}
                                    </span>
                                    <span className="cursor-pointer flex items-center">
                                        {Array.from({length: cat.depth}).map((_, index) => (
                                            <span key={index}>&ensp;&ensp;</span>
                                        ))}
                                        {cat.depth !== 0 && (
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor" className="size-4">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499"/>
                                            </svg>
                                        )}
                                        <span className="pl-2">
                                            {cat.name}
                                        </span>
                                        {/* Add button */}
                                        <span onClick={() => setEditMode(false)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                            </svg>
                                        </span>
                                        {/* Edit button */}
                                        <span onClick={() => setEditMode(true)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
                                            </svg>
                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Right side: Category Details */}
                    <div className="w-2/3 pl-6">
                        <div>
                            {
                                clickedCt &&
                                <CategoryBreadcrumb clickedCt={clickedCt} categories={categories} newCategory={newCategory}/>
                            }
                        </div>
                        {/*input field*/}
                        <div className={`${!isInputField && 'hidden'}`}>
                            <form onSubmit={handleFormSubmit}>
                                <input
                                    type="text"
                                    placeholder="카테고리 이름"
                                    value={editMode ? clickedCt?.name : newCategory.name}
                                    onChange={(e) => {
                                        editMode ? setClickedCt({
                                            ...clickedCt,
                                            name: e.target.value
                                        } as any) : setNewCategory({...newCategory, name: e.target.value})
                                    }}
                                    className={`mb-3 w-full p-2 border border-gray-300 rounded`}
                                />
                                <textarea
                                    placeholder="카테고리 설명"
                                    value={editMode ? clickedCt?.description : newCategory.description}
                                    onChange={(e) => {
                                        editMode ? setClickedCt({
                                            ...clickedCt,
                                            description: e.target.value
                                        } as any) : setNewCategory({...newCategory, description: e.target.value})
                                    }}
                                    className="mb-3 w-full p-2 border border-gray-300 rounded"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded">
                                    {editMode ? "카테고리 수정" : "카테고리 추가"}
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </AdminModal>
    );
}
