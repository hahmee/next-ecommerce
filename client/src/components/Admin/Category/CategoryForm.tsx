'use client';
import CategoryBreadcrumb from "@/components/Admin/Category/CategoryBreadcrumb";
import React, {FormEvent, useCallback, useState} from "react";
import {Mode} from "@/types/mode";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Category} from "@/interface/Category";
import {fetchJWT} from "@/utils/fetchJWT";
import toast from "react-hot-toast";
import {DataResponse} from "@/interface/DataResponse";
import {getCategory, getCategoryPaths} from "@/apis/adminAPI";
import {useRouter} from "next/navigation";
import Image from "next/image";


interface Props {
    type: Mode;
    id?: string; //클릭한 id 값
}

const CategoryForm = ({type, id}: Props) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [file, setFile] = useState<File>();
    const {
        isLoading,
        data: originalData,
        error
    } = useQuery<DataResponse<Category>, Object, Category, [_1: string, _2: string]>({
        queryKey: ['category', id!],
        queryFn: getCategory,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        throwOnError: true,
        enabled: type === Mode.EDIT && !!id,
        select: useCallback((data: DataResponse<Category>) => {
            return data.data;
        }, []),
    });

    const [filePreview, setFilePreview] = useState<string>(originalData?.uploadFileName || "");

    const {isLoading: isPathLoading, data: categoryPaths, error: pathError} = useQuery<DataResponse<Category[]>, Object, Category[], [_1: string, _2: string]>({
        queryKey: ['categoryPaths', id!],
        queryFn: getCategoryPaths,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        throwOnError:true,
        enabled: !!id, //id 있을때만(서브 카테고리일떄만)
        select: useCallback((data: DataResponse<Category[]>) => {
            return data.data;
        }, []),

    });

    const mutation = useMutation({
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const cname = formData.get('cname') || ""; // input의 cname 속성
            const cdesc = formData.get('cdesc') || ""; // input의 cdesc 속성

            formData.append("parentCategoryId", id || "");

            if (cname === "" || cdesc === "") {
                throw new Error("카테고리명과 설명이 필요합니다.");
            }

            //add인데 file까지 없으면
            if (!originalData && !file) {
                throw new Error("이미지는 한 개 이상 첨부해주세요.");
            }

            const maxSize = 10 * 1024 * 1024; // 10MB

            console.log("file",file)
            // 각 파일의 크기를 체크
            if (file && file.size !== undefined && file.size > maxSize) {
                throw new Error("파일의 크기가 100MB를 초과합니다.");
            }

            if (type === Mode.ADD) {

                if (file) {
                    formData.append("file", file);
                }

                //새로운 카테고리
                return await fetchJWT(`/api/category/`, {
                    method: "POST",
                    credentials: 'include',
                    body: formData as FormData,
                }); // json 형태로 이미 반환

            } else {

                // 새로 첨부한 파일 없이 기존꺼 그대로 간다면
                if (!file) {
                    if (originalData) {
                        formData.append(`uploadFileName`, originalData.uploadFileName as string); // 실제 파일 객체
                        formData.append(`uploadFileKey`, originalData.uploadFileKey as string); // 실제 파일 객체
                    }
                } else { //새로운 파일 첨부했다면
                    formData.append("file", file);
                }

                //formData 보내주기
                return await fetchJWT(`/api/category/${id}`, {
                    method: "PUT",
                    credentials: 'include',
                    body: formData as FormData,
                });
            }
        },
        async onSuccess(response, variable) {
            const newCategory: Category = response.data; // 수정 및 추가된 data 반환 ...
            toast.success('업로드 성공했습니다.');

            if (queryClient.getQueryData(['adminCategories', {page: 1, size: 10, search: ""}])) {
                queryClient.setQueryData(['adminCategories', {page: 1, size: 10, search: ""}], (prevData: { data: { dtoList: Category[] } }) => {
                    // 카테고리 추가 로직
                    if (type === Mode.ADD) {
                        if (!newCategory.parentCategoryId) {
                            // 메인 카테고리일 경우 맨 앞에 추가
                            prevData.data.dtoList.unshift(newCategory);
                        } else {
                            // 서브 카테고리일 때, 부모 카테고리 찾아서 추가
                            const parentCategory = prevData.data.dtoList.find(category => category.cno === newCategory.parentCategoryId);
                            if (parentCategory) {
                                if (!parentCategory.subCategories) {
                                    parentCategory.subCategories = [];
                                }
                                parentCategory.subCategories.push(newCategory);
                            }
                        }
                    } else {
                        // 수정 로직: 기존 카테고리 및 자식 카테고리까지 수정
                        prevData.data.dtoList = prevData.data.dtoList.map(category => updateCategory(category, newCategory));
                    }

                    return prevData; // 수정된 데이터 반환
                });
            }

            if (queryClient.getQueryData(['category', newCategory.cno.toString()])) {
                queryClient.setQueryData(['category', newCategory.cno.toString()], (prevData: { data: Category }) => {
                    const shallow = {...prevData};
                    shallow.data = newCategory;
                    return shallow;
                });
            }

            if (queryClient.getQueryData(['categoryPaths', newCategory.cno.toString()])) {
                queryClient.setQueryData(['categoryPaths', newCategory.cno.toString()], (prevData: { data: Category[] }) => {
                    const updatedPaths = prevData.data.map(category =>
                        category.cno === newCategory.cno ? newCategory : category
                    );
                    return { data: updatedPaths };
                });
            }

            router.push(`/admin/category`); // 모달 닫기 시 이 경로로 이동

        },
        onError(error) {
            console.log('error/....', error);
            toast.error(`오류 발생: ${error}`);
        }
    });

    // 재귀적으로 카테고리 및 하위 카테고리 업데이트
    const updateCategory = (category: Category, newCategory: Category) => {

        if (category.cno === newCategory.cno) {
            // 수정된 카테고리
            const updatedCategory = {...category, ...newCategory};

            // 자식 카테고리가 있을 경우, 재귀적으로 처리
            if (updatedCategory.subCategories && updatedCategory.subCategories.length > 0) {
                updatedCategory.subCategories = updatedCategory.subCategories.map(subCategory =>
                    updateCategory(subCategory, newCategory) // 자식 카테고리까지 재귀적으로 수정
                );
            }

            return updatedCategory;
        }

        // 자식 카테고리가 있을 경우, 그 자식도 재귀적으로 탐색
        if (category.subCategories && category.subCategories.length > 0) {
            category.subCategories = category.subCategories.map(subCategory =>
                updateCategory(subCategory, newCategory)
            );
        }

        return category;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];  // 선택된 첫 번째 파일
        if (file) {
            setFile(file);  // 파일 이름 추출하여 상태에 저장
            setFilePreview(URL.createObjectURL(file));
        }
    };

    return (
        <form className="p-4 md:p-5 " onSubmit={mutation.mutate}>
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
                        defaultValue={type === Mode.EDIT ? originalData?.cname : ""}
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
                        defaultValue={type === Mode.EDIT ? originalData?.cdesc : ""}
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>


                <div className="col-span-2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        사진첨부
                    </label>

                    <div className="w-full">
                        {
                            type === Mode.EDIT ? (
                                <Image
                                    src={filePreview}
                                    alt="image"
                                    width={500}
                                    height={500}
                                    className="w-full h-40 object-cover"
                                />
                            ) : (
                                file ? (
                                    <Image
                                        src={filePreview}
                                        alt="image"
                                        width={500}
                                        height={500}
                                        className="w-full h-40 object-cover"
                                    />
                                ) : (
                                    <div>No file selected</div>  // 파일이 없을 경우 대체 UI
                                )
                            )
                        }
                    </div>
                    <input id="file" name="file" type="file" accept="image/*"
                           onChange={handleFileChange}  // 파일 변경 시 호출될 이벤트 핸들러
                           className="mt-2 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"/>
                </div>
                {/*<div className="col-span-2">*/}
                {/*    <label className="mb-3 block text-sm font-medium text-black dark:text-white">*/}
                {/*        사용여부*/}
                {/*    </label>*/}
                {/*    <label className="inline-flex items-center cursor-pointer">*/}
                {/*        <input type="checkbox" value="" className="sr-only peer"/>*/}
                {/*        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>*/}
                {/*        <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">사용여부</span>*/}
                {/*    </label>*/}
                {/*    /!*<Select label={"사용여부"} options={useOptions}*!/*/}
                {/*    /!*        defaultOption={"사용여부를 선택해주세요."}*!/*/}
                {/*    /!*        originalData={undefined}*!/*/}
                {/*    /!*        name="brand"/>*!/*/}
                {/*</div>*/}
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
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1}
                             stroke="currentColor" className="me-1 -ms-1 w-5 h-5">
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
