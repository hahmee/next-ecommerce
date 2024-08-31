"use client";

import React, {FormEvent, useCallback, useEffect, useRef} from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ImageUploadForm from "@/components/Admin/Product/ImageUploadForm";
import Select from "@/components/Admin/Product/Select";
import MultiSelect from "@/components/Admin/Product/MultiSelect";
import RadioButton from "@/components/Admin/Product/RadioButton";
import {Option} from "@/interface/Option";
import BackButton from "@/components/Admin/Product/BackButton";
import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {useProductImageStore} from "@/store/productImageStore";
import toast from "react-hot-toast";
import {SalesStatus} from "@/types/salesStatus";
import QuillEditor from "@/components/Admin/Product/QuillEditor";
import {DataResponse} from "@/interface/DataResponse";
import {Product} from "@/interface/Product";
import {getProduct} from "@/app/(admin)/admin/products/[id]/_lib/getProduct";

export const brandOptions:  Array<Option<String>> = [
    {id: 'brand-option1', content:'브랜드 옵션1'},
    {id: 'brand-option2', content:'브랜드 옵션2'},
    {id: 'brand-option3', content:'브랜드 옵션3'},
];
export const categoryOptions: Array<Option<String>> = [
    {id:'category-option1', content:'카테고리 옵션1'},
    {id:'category-option2', content:'카테고리 옵션2'},
    {id:'category-option3', content:'카테고리 옵션3'},
]

export const salesOptions: Array<Option<SalesStatus>> = [
    {id: SalesStatus.ONSALE, content:'판매중'},
    {id: SalesStatus.SOLDOUT, content:'재고없음'},
    {id: SalesStatus.STOPSALE, content:'판매중지'},
];


interface Props {
    type: string;
    id?: string;
}

const ProductForm = ({type, id}: Props) => {
    const productImageStore = useProductImageStore();
    //type 변경하기
    const quillRef = useRef<any>(null);


    // modify일 때만 getProduct하기
    const {isLoading, data: originalData, error} = useQuery<DataResponse<Product>, Object, Product, [_1: string, _2: string]>({
        queryKey: ['productSingle', id!],
        queryFn: getProduct,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        enabled: !!id, // id가 존재할 때만 쿼리 요청 실행(modify일때만)

        select: useCallback((data: DataResponse<Product>) => {
            productImageStore.setUploadFileNames(data.data.uploadFileNames || []);
            productImageStore.setUploadFileKeys(data.data.uploadFileKeys || []);
            return data.data
        }, []),

    });

    // const originalData = data?.data;
    console.log('originalData...', originalData);
    //productImageStore에 이전 파일 데이터 담아준다.
    //ERROR 발생
    // productImageStore.setUploadFileNames(originalData?.uploadFileNames || []);
    // productImageStore.setUploadFileKeys(originalData?.uploadFileKeys || []);




    // //수정 시, 예전에 올렸던 이미지 리스트
    // const originalImageNames: string[] = [];
    // const originalImageKeys: string[] = [];


    const mutation = useMutation({
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();
            let pdesc = "";

            if (quillRef.current) {
                pdesc = quillRef?.current?.value;
            }
            if (type === "add") {

                // const

                const formData = new FormData(e.target as HTMLFormElement);
                const inputs = Object.fromEntries(formData);

                formData.append("pdesc", pdesc);

                productImageStore.files.forEach((p) => {
                    p && formData.append('files', p.file!);
                });

                return fetchWithAuth(`/api/products/`, {
                    method: "POST",
                    credentials: 'include',
                    body: formData as FormData,
                }); // json 형태로 이미 반환

            } else {

                const formData = new FormData(e.target as HTMLFormElement);
                const inputs = Object.fromEntries(formData);

                console.log('inputs', inputs);
                formData.append("pdesc", pdesc);

                console.log('productImageStore.files', productImageStore.files); // 남아있는 파일들
                // debugger;
                //새로 업로드한 파일들
                productImageStore.files.forEach((p) => {
                    if(p.file != undefined) {
                        p && formData.append('files', p.file!);
                    }
                });

                console.log('??뭐야', productImageStore.uploadFileNames)
                console.log('??뭐야', productImageStore.uploadFileKeys)

                //이전에 올렸던 파일들 중에 살릴 것들 (삭제 안 한 것들)
                productImageStore.uploadFileNames.forEach((i) => {
                    formData.append('uploadFileNames', i);
                });

                productImageStore.uploadFileKeys.forEach((i) => {
                    formData.append('uploadFileKeys', i);
                });

                // debugger;

                // 구조분해를 활용하면 key와 value를 동시에 출력하는 것도 가능하다
                for (const [key, value] of formData.entries() as any) {
                    console.log(key, value);
                };

                return fetchWithAuth(`/api/products/${id}`, {
                    method: "PUT",
                    credentials: 'include',
                    body: formData as FormData,
                    // headers: { 'Content-Type': 'multipart/form-data' }
                }); // json 형태로 이미 반환
            }


        },
        async onSuccess(response, variable) {
            // console.log('response', response);
            // console.log('data...', data);

            toast.success('업로드 성공했습니다.');

        },
        onError(error) {
            console.log('error/....', error.message);
            toast.error(`업로드 중 에러가 발생했습니다.`);

        }
    });


    if (isLoading) return "Loading...";
    if (error) return 'An error has occurred: ' + error;

    return (
        <>
            <form onSubmit={mutation.mutate}>
                <div className="mx-auto">
                    <Breadcrumb pageName={type === "add" ? "제품 등록" : "제품 수정"}/>
                    <div className="mb-6 flex gap-3 justify-end sm:flex-row">
                        <BackButton/>
                        <button type="submit"
                                className="inline-flex items-center rounded justify-center gap-2.5 bg-primary-700 px-8 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-8">
                            {
                                type === "add" ? "저장하기" : "수정하기"
                            }
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-9">
                        <div className="flex flex-col gap-9">
                            <div
                                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        이미지 및 동영상
                                    </h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="mb-6">
                                        <ImageUploadForm/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-9">
                            <div
                                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        기본정보
                                    </h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="mb-4.5">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            상품명 <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="pname"
                                            name="pname"
                                            placeholder="상품명을 입력해주세요."
                                            required
                                            defaultValue={originalData?.pname || ""}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="mb-4.5">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            판매상태 <span className="text-meta-1">*</span>
                                        </label>
                                        <RadioButton options={salesOptions} name="salesStatus"
                                                     originalData={originalData?.salesStatus}/>
                                    </div>

                                    <div className="mb-4.5">
                                        <Select label={"브랜드"} options={brandOptions} defaultOption={"브랜드를 선택해주세요."}
                                                originalData={originalData?.brand}
                                                name="brand"/>
                                    </div>

                                    <div className="mb-4.5">
                                        <MultiSelect label={"카테고리"} optionList={categoryOptions} id="multiSelect"
                                                     originalData={originalData?.categoryList}
                                                     name="categoryList" defaultOption={"카테고리를 선택해주세요."}/>
                                    </div>

                                    <div className="mb-4.5">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            판매 가격 <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            id="price"
                                            name="price"
                                            required
                                            defaultValue={originalData?.price || ""}
                                            placeholder="판매가격을 입력해주세요."
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            SKU <span className="text-meta-1">*</span>
                                        </label>
                                        <input
                                            id="sku"
                                            name="sku"
                                            type="text"
                                            required
                                            defaultValue={originalData?.sku || ""}
                                            placeholder="SKU를 입력해주세요."
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>


                                </div>
                            </div>
                        </div>


                        <div className="flex flex-col gap-9">
                            <div
                                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        상품 상세
                                    </h3>
                                </div>
                                <div className="p-6.5">

                                    <div className="mb-6">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            상품 설명 <span className="text-meta-1">*</span>
                                        </label>

                                        <QuillEditor quillRef={quillRef} originalData={originalData?.pdesc}/>

                                    </div>

                                    <div className="mb-6">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            환불 정책
                                        </label>
                                        <textarea
                                            id="refundPolicy"
                                            name="refundPolicy"
                                            rows={3}
                                            placeholder="환불 정책을 입력해주세요."
                                            required
                                            defaultValue={originalData?.refundPolicy || ""}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        ></textarea>
                                    </div>

                                    <div className="mb-6">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            교환 정책
                                        </label>
                                        <textarea
                                            id="changePolicy"
                                            name="changePolicy"
                                            rows={3}
                                            placeholder="교환 정책을 입력해주세요."
                                            required
                                            defaultValue={originalData?.changePolicy || ""}
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        ></textarea>
                                    </div>


                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </>
    );
};

export default ProductForm;