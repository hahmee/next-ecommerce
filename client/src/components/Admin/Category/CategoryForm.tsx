'use client';
import CategoryBreadcrumb from "@/components/Admin/CategoryBreadcrumb";
import React, {FormEvent, useCallback} from "react";
import {Mode} from "@/types/mode";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Category} from "@/interface/Category";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import toast from "react-hot-toast";
import {DataResponse} from "@/interface/DataResponse";
import {getCategory} from "@/app/(admin)/admin/category/edit-category/[id]/_lib/getCategory";
import {getCategoryPaths} from "@/app/(admin)/admin/category/edit-category/[id]/_lib/getCategoryPaths";
import Select from "@/components/Admin/Product/Select";
import {Option} from "@/interface/Option";
import {FileDTO} from "@/interface/FileDTO";

export const useOptions:  Array<Option<string>> = [
    {id: 'brand-option1', content:'브랜드 옵션1'},
    {id: 'brand-option2', content:'브랜드 옵션2'},
    {id: 'brand-option3', content:'브랜드 옵션3'},
];

interface Props {
    type: Mode;
    id?: string; //클릭한 id 값
}

const CategoryForm = ({type, id}: Props) => {
    const queryClient = useQueryClient();

    const {isLoading, data: originalData, error} = useQuery<DataResponse<Category>, Object, Category, [_1: string, _2: string]>({
        queryKey: ['category', id!],
        queryFn: getCategory,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        enabled: type === Mode.EDIT && !!id,
        select: useCallback((data: DataResponse<Category>) => {
            return data.data;
        }, []),

    });

    const {isLoading: isPathLoading, data: categoryPaths, error: pathError} = useQuery<DataResponse<Category[]>, Object, Category[], [_1: string, _2: string]>({
        queryKey: ['categoryPaths', id!],
        queryFn: getCategoryPaths,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        enabled: !!id, //id 있을때만(서브 카테고리일떄만)
        select: useCallback((data: DataResponse<Category[]>) => {
            return data.data;
        }, []),

    });

    console.log('categoryPaths', categoryPaths);

    const mutation = useMutation({
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();
            // console.log('e.target', e.target);
            const formData = new FormData(e.target as HTMLFormElement);
            const cname = formData.get('cname') || ""; // input의 cname 속성
            const cdesc = formData.get('cdesc') || ""; // input의 cdesc 속성
            const file = formData.get('file') as File;
            // const sendFile: FileDTO<File> = {file: file, ord: 0};

            formData.append("cname", cname);
            formData.append("cdesc", cdesc);
            // formData.append("subCategories", [] as any);
            formData.append("parentCategoryId", id || "");
            formData.append("file", file);


            console.log('formData', formData);
            console.log('file..', file);


            if (type ===  Mode.ADD ) {
                if (cname === "" || cdesc === "") {
                    // return; //undefined 반환 -> mutationFn 성공적 실행으로 간주
                    return Promise.reject(new Error("카테고리명과 설명이 필요합니다.")); // 에러 처리
                }

                //새로운 카테고리
                const newCategoryObj = {
                    // cno: null,
                    cname: cname as string,
                    cdesc: cdesc as string,
                    subCategories: [],
                    parentCategoryId: Number(id) || null,
                    // file: sendFile,


                };

                return fetchWithAuth(`/api/category/`, {
                    // method: "POST",
                    // credentials: 'include',
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // },
                    // body: JSON.stringify(newCategoryObj),
                    method: "POST",
                    credentials: 'include',
                    body: formData as FormData,

                }); // json 형태로 이미 반환


            } else {
                if (cname === "" || cdesc === "") {
                    // return; //undefined 반환 -> mutationFn 성공적 실행으로 간주
                    return Promise.reject(new Error("카테고리명과 설명이 필요합니다.")); // 에러 처리

                }

                //수정된 카테고리
                const editCategoryObj: Category = {
                    cno: Number(id),
                    cname: cname as string,
                    cdesc: cdesc as string,
                };

                console.log('editCategoryObj', editCategoryObj);
                return fetchWithAuth(`/api/category/${id}`, {
                    method: "PUT",
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(editCategoryObj),
                });
            }
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
        <form className="p-4 md:p-5" onSubmit={mutation.mutate}>
            <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                    <CategoryBreadcrumb categoryPaths={categoryPaths ?? []}/>
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
                        defaultValue={ type === Mode.EDIT ? originalData?.cname : ""}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="col-span-2">
                    <label
                        className="mb-3 block text-sm font-medium text-black dark:text-white">
                        카테고리 설명
                    </label>
                    <textarea
                        id="cdesc"
                        name="cdesc"
                        placeholder="카테고리 설명을 입력해주세요."
                        required
                        defaultValue={ type === Mode.EDIT ? originalData?.cdesc : ""}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="col-span-2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        사진첨부
                    </label>
                    <input id="file" name="file" type="file" className="w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                    />
                </div>
                <div className="col-span-2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        사용여부
                    </label>
                    <label className="inline-flex items-center cursor-pointer">
                        <input type="checkbox" value="" className="sr-only peer"/>
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">사용여부</span>
                    </label>
                    {/*<Select label={"사용여부"} options={useOptions}*/}
                    {/*        defaultOption={"사용여부를 선택해주세요."}*/}
                    {/*        originalData={undefined}*/}
                    {/*        name="brand"/>*/}
                </div>
            </div>
            <button type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {
                    type === Mode.ADD ?
                        <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                  clipRule="evenodd"></path>
                        </svg>
                        :
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="me-1 -ms-1 w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                        </svg>

                }


                {type === Mode.ADD ? "카테고리 추가" : "카테고리 수정"}
            </button>
        </form>
    );
};
export default CategoryForm;
