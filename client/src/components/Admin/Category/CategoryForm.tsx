'use client';
import CategoryBreadcrumb from "@/components/Admin/CategoryBreadcrumb";
import React, {FormEvent, useState} from "react";
import {Mode} from "@/types/mode";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {Category} from "@/interface/Category";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import toast from "react-hot-toast";
import {useCategoryStore} from "@/store/categoryStore";
import {useRouter} from "next/navigation";

interface Props {
    type: Mode;
    id?: string; //클릭한 id 값
}

const CategoryForm = ({type, id}: Props) => {
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
            console.log('e.target',e.target)
            console.log('categoryStore', categories);
            const formData = new FormData(e.target as HTMLFormElement);

            console.log('formData', formData);
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
                    parentCategoryId: parentCategory?.cno,
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


    console.log('??',id)
    return (
        <form className="p-4 md:p-5" onSubmit={mutation.mutate}>
            <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                    <CategoryBreadcrumb/>
                </div>

                <div className="col-span-2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        카테고리명
                    </label>
                    <input
                        type="text"
                        id="cname"
                        name="cname"
                        placeholder="카테고리명을 입력해주세요."
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="col-span-2">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white">
                        카테고리설명
                    </label>
                    <textarea
                        id="cdesc"
                        name="cdesc"
                        placeholder="카테고리 설명을 입력해주세요."
                        required
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                {/*<div className="col-span-2">*/}
                {/*    <label className="mb-3 block text-sm font-medium text-black dark:text-white">*/}
                {/*        파일첨부*/}
                {/*    </label>*/}
                {/*    <input*/}
                {/*        type="file"*/}
                {/*        className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"*/}
                {/*    />*/}
                {/*</div>*/}
                {/*<div className="col-span-2">*/}
                {/*    <Select label={"사용여부"} options={useOptions}*/}
                {/*            defaultOption={"사용여부를 선택해주세요."}*/}
                {/*            originalData={undefined}*/}
                {/*            name="brand"/>*/}
                {/*</div>*/}
            </div>
            <button type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"
                     xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"></path>
                </svg>
                {type === Mode.ADD ? "카테고리 추가" : "카테고리 수정"}
            </button>
        </form>
    );
};
export default CategoryForm;
