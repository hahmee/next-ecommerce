'use client';

import CategoryBreadcrumb from "@/components/Admin/Category/CategoryBreadcrumb";
import React, {useEffect, useState} from "react";
import {Mode} from "@/types/mode";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Category} from "@/interface/Category";
import {fetchJWT} from "@/utils/fetchJWT";
import toast from "react-hot-toast";
import {getCategory, getCategoryPaths} from "@/apis/adminAPI";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {unwrap} from "@/utils/unwrap";
import {FieldErrors, useForm} from "react-hook-form";

interface Props {
    type: Mode;
    id?: string;
}

interface FormValues {
    cname: string;
    cdesc: string;
    file: FileList;
}

const CategoryForm = ({type, id}: Props) => {
    const queryClient = useQueryClient();
    const router = useRouter();
    const [preview, setPreview] = useState<string>("");

    const {register, handleSubmit, setValue,  watch, reset} = useForm<FormValues>();
    const file = watch("file")?.[0];

    const {
        data: originalData
    } = useQuery<Category, Object, Category, [_1: string, _2: string]>({
        queryKey: ['category', id!],
        queryFn: getCategory,
        enabled: type === Mode.EDIT && !!id,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
    });


    const {data: categoryPaths} = useQuery<Category[], Object, Category[], [_1: string, _2: string]>({
        queryKey: ['categoryPaths', id!],
        queryFn: getCategoryPaths,
        enabled: !!id,
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true,
    });


    useEffect(() => {
        if (originalData && type === Mode.EDIT) {
            reset({
                cname: originalData.cname,
                cdesc: originalData.cdesc
            });
            setPreview(originalData.uploadFileName || "");
        }
    }, [originalData, type, reset]);

    useEffect(() => {
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    }, [file]);

    const mutation = useMutation({
        mutationFn: async (form: FormValues) => {
            const formData = new FormData();

            formData.append("cname", form.cname);
            formData.append("cdesc", form.cdesc);
            formData.append("parentCategoryId", id || "");

            if (type === Mode.ADD) {
                if (!form.file?.[0]) {
                    throw new Error("이미지는 한 개 이상 첨부해주세요.");
                }
                const image = form.file[0];
                if (image.size > 10 * 1024 * 1024) {
                    throw new Error("파일의 크기가 10MB를 초과합니다.");
                }
                formData.append("file", image);

                return unwrap(await fetchJWT(`/api/category/`, {
                    method: "POST",
                    credentials: 'include',
                    body: formData
                }));
            } else {
                if (form.file?.[0]) {
                    formData.append("file", form.file[0]);
                } else {
                    if (originalData) {
                        formData.append("uploadFileName", originalData.uploadFileName || "");
                        formData.append("uploadFileKey", originalData.uploadFileKey || "");
                    }
                }

                return unwrap(await fetchJWT(`/api/category/${id}`, {
                    method: "PUT",
                    credentials: 'include',
                    body: formData
                }));
            }
        },
        onSuccess: async (newCategory: Category) => {
            console.log('newCategory', newCategory);
            toast.success("업로드 성공했습니다.");

            await queryClient.invalidateQueries({queryKey: ["adminCategories"]});
            queryClient.setQueryData(['category', newCategory.cno.toString()], newCategory);

            queryClient.setQueryData(['categoryPaths', newCategory.cno.toString()], (prev: Category[] = []) =>
                prev.map(c => c.cno === newCategory.cno ? newCategory : c)
            );

            // 목록 업데이트 로직 생략 가능
            router.push("/admin/category");
        },
        onError: (error: any) => {
            toast.error(`오류 발생: ${error.message || error}`);
        }
    });

    const onInvalid = (errors: FieldErrors<FormValues>) => {
        const firstError = Object.values(errors)[0];
        if (firstError?.message) {
            toast.error(firstError.message.toString());
        }
    };

    return (
        <form onSubmit={
            handleSubmit(async (data) => {
                await mutation.mutateAsync(data);
            }, onInvalid)
        } className="p-4 md:p-5">
            <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                    <CategoryBreadcrumb categoryPaths={categoryPaths ?? []}/>
                </div>

                <div className="col-span-2">
                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                        카테고리명
                    </label>
                    <input
                        {...register("cname", {required: "카테고리명은 필수입니다."})}
                        type="text"
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        placeholder="카테고리명을 입력해주세요."
                    />
                </div>

                <div className="col-span-2">
                    <label className="block mb-1">카테고리 설명</label>
                    <textarea
                        {...register("cdesc", {required: "카테고리 설명은 필수입니다."})}
                        placeholder="카테고리 설명을 입력해주세요."
                        className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                    />
                </div>

                <div className="col-span-2">
                    <label  htmlFor="fileInput" className="mb-3 block text-sm font-medium text-black dark:text-white">
                        사진첨부
                    </label>
                    <div className="w-full">
                        {preview ? (
                            <Image src={preview} alt="미리보기" width={500} height={300}
                                   className="w-full h-40 object-cover"/>
                        ) : (
                            <div>No file selected</div>
                        )}
                        <input
                            type="file"
                            id="fileInput"
                            accept="image/*"
                            {...register("file")}
                            className="mt-2 w-full cursor-pointer rounded-lg border-[1.5px] border-stroke bg-transparent outline-none transition file:mr-5 file:border-collapse file:cursor-pointer file:border-0 file:border-r file:border-solid file:border-stroke file:bg-whiter file:px-5 file:py-3 file:hover:bg-primary file:hover:bg-opacity-10 focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:file:border-form-strokedark dark:file:bg-white/30 dark:file:text-white dark:focus:border-primary"
                        />
                    </div>
                </div>
            </div>

            <button type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                {type === Mode.ADD ? (
                    <svg className="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                        <path fillRule="evenodd"
                              d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                              clipRule="evenodd"></path>
                    </svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1}
                         stroke="currentColor" className="me-1 -ms-1 w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                    </svg>
                )}
                {type === Mode.ADD ? "카테고리 추가" : "카테고리 수정"}
            </button>
        </form>

    );
};

export default CategoryForm;
