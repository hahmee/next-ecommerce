'use client';
import AdminModal from "@/components/Admin/AdminModal";
import React, {FormEvent, useState} from "react";
import {useRouter} from "next/navigation";
import CategoryBreadcrumb from "@/components/Admin/CategoryBreadcrumb";
import {Category} from "@/interface/Category";
import {useCategoryStore} from "@/store/categoryStore";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import toast from "react-hot-toast";
import CategoryForm from "@/components/Admin/Category/CategoryForm";

export enum Mode {
    ROOT = 'root',
    ADD = 'add',
    EDIT = 'edit',
}

interface Props {
    type: string;
    id?: string;
}

export default function CategoryAddModal() {
    const [newCategory, setNewCategory] = useState({ cno: null, cname: "", cdesc: "" });
    // const [categories, setCategories] = useState<Category[]>();
    //지울 것
    const [parentCategory, setParentCategory] = useState<Category | null>(null);
    const [clickedCt, setClickedCt] = useState<Category | null>(null);
    const [isInputField, setIsInputField] = useState(false);
    const [mode, setMode] = useState(Mode.ROOT);
    const router = useRouter();
    const {categories, setCategories} = useCategoryStore();
    const queryClient = useQueryClient();

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
    
    const closeModal = () => {
        router.push(`/admin/category`);
    };


    const deleteCategory = async () => {
        if (!clickedCt) {
            alert("삭제할 카테고리를 선택해 주세요.");
            return;
        }

        const response = await fetchWithAuth(`/api/category/${clickedCt.cno}`, {
            method: "DELETE",
            credentials: 'include',
        });

        console.log('response', response);
        toast.success('삭제되었습니다..');

        await queryClient.invalidateQueries({queryKey: ['categories']});
        setClickedCt(null); // 삭제 후 선택된 카테고리 초기화
    };

    const clickCategory = (category: Category) => {
        setClickedCt(category);
        setParentCategory(category);
        setIsInputField(true);
        setMode(Mode.EDIT);
    };

    const addRootCateogry = () => {
        setIsInputField(true);
        setParentCategory(null);
        setClickedCt({ cno: -1, cname: "", cdesc: "" });
        setNewCategory({ cno: null, cname: "", cdesc: "" });
        console.log(newCategoryId);
        setMode(Mode.ROOT);
    };

    const mutation = useMutation({
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();
            console.log('categoryStore', categories);

            if (mode ===  Mode.ADD || mode === Mode.ROOT) {
                if (newCategory.cname.trim() === "" || newCategory.cdesc.trim() === "") {
                    // return; //undefined 반환 -> mutationFn 성공적 실행으로 간주
                    return Promise.reject(new Error("카테고리명과 설명이 필요합니다.")); // 에러 처리

                }

                console.log('parentCategory,,', parentCategory);

                //새로운 카테고리
                const newCategoryObj: Category = {
                    cno: newCategoryId,
                    cname: newCategory.cname,
                    cdesc: newCategory.cdesc,
                    subCategories: [],
                    parentCategory: parentCategory,
                };

                // setMode(Mode.ADD);

                return fetchWithAuth(`/api/category/`, {
                    method: "POST",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(newCategoryObj),
                }); // json 형태로 이미 반환


            } else {
                if (clickedCt?.cname.trim() === "" || clickedCt?.cdesc.trim() === "") {
                    return Promise.reject(new Error("카테고리명과 설명이 필요합니다.")); // 에러 처리
                }

                console.log('clickedCt', clickedCt);

                return fetchWithAuth(`/api/category/${clickedCt?.cno}`, {
                    method: "PUT",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(clickedCt),
                }); // json 형태로 이미 반환

            }
            // setMode(Mode.EDIT);
            // setNewCategory({ cno: null, cname: "", cdesc: "" });
            // setParentCategoryId(null);
            // setParentCategory(null);


        },
        async onSuccess(response, variable) {

            toast.success('업로드 성공했습니다.');
            //최신 카테고리 목록
            await queryClient.invalidateQueries({queryKey: ['categories']});

           },

        onError(error) {
            console.log('error/....', error.message);
            toast.error(error.message);

        }
    });

    return (
        <AdminModal clickModal={closeModal} modalTitle={"상품 카테고리 추가"}>
           <CategoryForm type={"add"}/>
        </AdminModal>
    );
}
