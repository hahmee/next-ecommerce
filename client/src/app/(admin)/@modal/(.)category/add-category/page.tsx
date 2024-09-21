'use client';
import AdminModal from "@/components/Admin/AdminModal";
import React, {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import CategoryBreadcrumb from "@/components/Admin/CategoryBreadcrumb";
import {Category} from "@/interface/Category";

export enum Mode {
    ROOT = 'root',
    ADD = 'add',
    EDIT = 'edit',
}

export default function CategoryModal() {
    const [newCategory, setNewCategory] = useState({ cno: null, cname: "", cdesc: "" });
    const [categories, setCategories] = useState<Category[]>();
    const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
    const [clickedCt, setClickedCt] = useState<Category | null>(null);
    const [isInputField, setIsInputField] = useState(false);
    const [mode, setMode] = useState(Mode.ROOT);
    const router = useRouter();

    const flattenCategories = (categories: Category[], depth: number = 0, prefix: string = ""): {
        cno: number;
        cname: string,
        category: Category,
        depth: number;
    }[] => {
        return categories.reduce<{ cno: number; cname: string; category: Category, depth: number }[]>((acc, category) => {
            acc.push({ cno: category.cno, cname: `${prefix}${category.cname}`, category, depth });

            if (category.subCategories && category.subCategories.length > 0) {
                acc = acc.concat(flattenCategories(category.subCategories, depth + 1, `${prefix}`));
            }
            return acc;
        }, []);
    };

    const [newCategoryId, setNewCategoryId] = useState<number>(flattenCategories(categories).length + 2);

    const addSubCategory = (categories: Category[], parentId: number, newCategory: Category): Category[] => {
        return categories.map(category => {
            if (category.cno === parentId) {
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

    const addNewCategory = () => {
        if (newCategory.cname.trim() === "" || newCategory.cdesc.trim() === "") {
            alert("카테고리명과 설명을 입력해주세요.");
            return;
        }

        const newCategoryObj: Category = {
            cno: newCategoryId,
            cname: newCategory.cname,
            cdesc: newCategory.cdesc,
            subCategories: [],
        };

        if (parentCategoryId === null) {
            setCategories([...categories, newCategoryObj]);
        } else {
            const updatedCategories = addSubCategory(categories, parentCategoryId, newCategoryObj);
            setCategories(updatedCategories);
        }

        setNewCategoryId(prev => prev + 1);
        setNewCategory({ cno: null, cname: "", cdesc: "" });
    };

    const editCategory = () => {
        if (clickedCt?.cname.trim() === "" || clickedCt?.cdesc.trim() === "") {
            alert("카테고리명과 설명을 입력해주세요.");
            return;
        }

        const updateCategory = (categories: Category[], updatedCategory: Category| null): Category[] => {
            return categories.map(category => {
                if (category.cno === updatedCategory?.cno) {
                    return { ...updatedCategory };
                }

                if (category.subCategories) {
                    return {
                        ...category,
                        subCategories: updateCategory(category.subCategories, updatedCategory),
                    };
                }

                return category;
            });
        };

        const updatedCategories = updateCategory(categories, clickedCt);
        setCategories(updatedCategories);
        setNewCategory({ cno: null, cname: "", cdesc: "" });
    };


    const closeModal = () => {
        router.push(`/admin/category`);
    };

    const deleteCategory = () => {
        if (!clickedCt) {
            alert("삭제할 카테고리를 선택해 주세요.");
            return;
        }

        const deleteCategoryFromList = (categories: Category[], categoryId: number): Category[] => {
            return categories
                .filter(category => category.cno !== categoryId) // 해당 ID를 가진 카테고리 삭제
                .map(category => ({
                    ...category,
                    subCategories: category.subCategories ? deleteCategoryFromList(category.subCategories, categoryId) : [],
                }));
        };

        // 선택한 카테고리의 ID를 이용해 카테고리 삭제
        const updatedCategories = deleteCategoryFromList(categories, clickedCt.cno);

        setCategories(updatedCategories);
        setClickedCt(null); // 삭제 후 선택된 카테고리 초기화
    };

    const clickCategory = (category: Category) => {
        setClickedCt(category);
        setParentCategoryId(category.cno);
        setIsInputField(true);
        setMode(Mode.EDIT);
    };

    const addRootCateogry = () => {
        setIsInputField(true);
        setParentCategoryId(null);
        setClickedCt({ cno: -1, cname: "", cdesc: "" });
        setNewCategory({ cno: null, cname: "", cdesc: "" });
        console.log(newCategoryId);
        setMode(Mode.ROOT);
    };

    const handleAddCategory = () => {
        if (newCategory.cname.trim() === "" || newCategory.cdesc.trim() === "") {
            alert("카테고리명과 설명을 입력해주세요.");
            return;
        }

        const newCategoryObj: Category = {
            cno: newCategoryId,
            cname: newCategory.cname,
            cdesc: newCategory.cdesc,
            subCategories: [],
        };

        if (parentCategoryId === null) {
            setCategories([...categories, newCategoryObj]);
        } else {
            const updatedCategories = addSubCategory(categories, parentCategoryId, newCategoryObj);
            setCategories(updatedCategories);
        }

        setNewCategory({ cno: null, cname: "", cdesc: "" });
        setParentCategoryId(null);
        setNewCategoryId(prev => prev + 1);
        setMode(Mode.ADD);
    };

    const handleEditCategory = () => {
        if (clickedCt?.cname.trim() === "" || clickedCt?.cdesc.trim() === "") {
            alert("카테고리명과 설명을 입력해주세요.");
            return;
        }

        const updateCategory = (categories: Category[], updatedCategory: Category|null): Category[] => {
            return categories.map(cat =>
                cat.cno === updatedCategory?.cno
                    ? { ...cat, name: updatedCategory.cname, description: updatedCategory?.cdesc }
                    : {
                        ...cat,
                        subCategories: cat.subCategories ? updateCategory(cat.subCategories, updatedCategory) : [],
                    }
            );
        };

        const updatedCategories = updateCategory(categories, clickedCt);
        setCategories(updatedCategories);
        setNewCategory({ cno: null, cname: "", cdesc: "" });
        setMode(Mode.EDIT);
    };


    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log(mode);
        if (mode === Mode.EDIT) {
            handleEditCategory();
        } else {
            handleAddCategory();
        }
    };

    return (
        <AdminModal clickModal={closeModal} modalTitle={"카테고리 관리"}>
            <div className="p-4 md:p-5 space-y-4">
                <div className="p-2 flex">
                    <div className="w-1/3 border-r pr-1">
                        <ul className="space-y-2">
                            <li className={`pl-1 flex items-center`} onClick={addRootCateogry}>
                                <span className="pl-2">루트 카테고리 추가</span>
                            </li>
                            {flattenCategories(categories).map((cat) => (
                                <li key={cat.cno}
                                    className={`pl-1 flex items-center ${cat.cno === clickedCt?.cno && 'bg-violet-500 active:bg-violet-700 focus:outline-none focus:ring focus:ring-violet-300'}`}
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
                                            {cat.cname}
                                        </span>
                                        {/*Add button*/}
                                        <span onClick={(e) => {
                                            e.stopPropagation(); //이벤트 전파 막음
                                            setMode(Mode.ADD);
                                            setIsInputField(true);

                                        }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                            </svg>
                                        </span>
                                        {/*Edit button*/}
                                        <span onClick={(e) => {
                                            e.stopPropagation(); //이벤트 전파 막음
                                            setMode(Mode.EDIT);
                                            setIsInputField(true);

                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth="1.5" stroke="currentColor" className="size-5">
                                                <path strokeLinecap="round" strokeLinejoin="round"
                                                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"/>
                                            </svg>
                                        </span>
                                        {/*Remove Button*/}
                                        <span onClick={(e) => {
                                            e.stopPropagation(); //이벤트 전파 막음
                                            deleteCategory();


                                        }}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                 strokeWidth={1.5} stroke="currentColor" className="size-5">
                                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"/>
                                            </svg>

                                        </span>
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="w-2/3 pl-6">
                        <div>
                            {mode === Mode.EDIT ? "카테고리 수정" : "카테고리 추가"}
                        </div>
                        <div>
                            {/*<CategoryBreadcrumb clickedCt={clickedCt} categories={categories} newCategory={newCategory}*/}
                            {/*                    mode={mode}/>*/}
                        </div>
                        <div className={`${!isInputField && 'hidden'}`}>
                            <form onSubmit={handleFormSubmit}>
                                <input
                                    type="text"
                                    placeholder="새 카테고리 이름을 입력해주세요."
                                    value={mode === Mode.EDIT ? clickedCt?.cname : newCategory.cname}
                                    onChange={(e) => {
                                        mode === Mode.EDIT
                                            ? setClickedCt({
                                                ...clickedCt,
                                                name: e.target.value
                                            } as any)
                                            : setNewCategory({...newCategory, cname: e.target.value});
                                    }}
                                    className={`mb-3 w-full p-2 border border-gray-300 rounded`}
                                />
                                <textarea
                                    placeholder="새 카테고리 설명을 입력해주세요."
                                    value={mode === Mode.EDIT ? clickedCt?.cdesc : newCategory.cdesc}
                                    onChange={(e) => {
                                        mode === Mode.EDIT
                                            ? setClickedCt({
                                                ...clickedCt,
                                                cdesc: e.target.value
                                            } as any)
                                            : setNewCategory({...newCategory, cdesc: e.target.value});
                                    }}
                                    className="mb-3 w-full p-2 border border-gray-300 rounded"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded">
                                    {mode === Mode.EDIT ? "카테고리 수정" : "카테고리 추가"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AdminModal>
    );
}
