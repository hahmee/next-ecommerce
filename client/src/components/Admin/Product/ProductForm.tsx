"use client";

import React, {FormEvent, useRef} from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ImageUploadForm from "@/components/Admin/Product/ImageUploadForm";
import Select from "@/components/Admin/Product/Select";
import MultiSelect from "@/components/Admin/Product/MultiSelect";
import RadioButton from "@/components/Admin/Product/RadioButton";
import {Option} from "@/interface/Option";
import BackButton from "@/components/Admin/Product/BackButton";
import {useMutation} from "@tanstack/react-query";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {useProductImageStore} from "@/store/productImageStore";
import toast from "react-hot-toast";
import {SalesStatus} from "@/types/salesStatus";
import QuillEditor from "@/components/Admin/Product/QuillEditor";

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


const ProductForm:React.FC = () => {

    const productImageStore = useProductImageStore();


    //type 변경하기
    const quillRef = useRef<any>(null);


    const mutation = useMutation({
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();


            console.log('quillRef', quillRef);
            let pdesc = "";

            if(quillRef.current) {
                pdesc = quillRef?.current?.value;
            }
            // const

            const formData = new FormData(e.target as HTMLFormElement);
            const inputs = Object.fromEntries(formData);
            console.log('eee', inputs.price);

            formData.append("pdesc", pdesc);

            productImageStore.files.forEach((p) => {
                p && formData.append('files', p.file);
            });

            return fetchWithAuth(`/api/products/`, {
                method: "POST",
                credentials: 'include',
                body: formData as FormData,
            }); // json 형태로 이미 반환

        },
        async onSuccess(response, variable) {
            console.log('response', response);
            // const newPost = await response.json();
            // console.log('newPost', newPost);
            // setContent('');
            // setPreview([]);
            // if (queryClient.getQueryData(['posts', 'recommends'])) {
            //     queryClient.setQueryData(['posts', 'recommends'], (prevData: { pages: Post[][] }) => {
            //         const shallow = {
            //             ...prevData,
            //             pages: [...prevData.pages],
            //         };
            //         shallow.pages[0] = [...shallow.pages[0]];
            //         shallow.pages[0].unshift(newPost);
            //         return shallow;
            //     });
            // }
            // if (queryClient.getQueryData(['posts', 'followings'])) {
            //     queryClient.setQueryData(['posts', 'followings'], (prevData: { pages: Post[][] }) => {
            //         const shallow = {
            //             ...prevData,
            //             pages: [...prevData.pages],
            //         };
            //         shallow.pages[0] = [...shallow.pages[0]];
            //         shallow.pages[0].unshift(newPost);
            //         return shallow;
            //     })
            // }
            // toast.success(TOAST_MESSAGE.Add_SUCCESS, TOAST_OPTION);
            toast.success('업로드 성공했습니다.');


        },
        onError(error) {

            console.log('error/....', error.message);
            // console.log(typeof error)
            // console.log(JSON.parse(error['message']));

            // console.log('??', JSON.parse(error.toString()).message);

            // const message = (error as Error).message;
            toast.error(`업로드 중 에러가 발생했습니다.`);

        }
    });

    return (
        <>
            <form onSubmit={mutation.mutate}>
                <div className="mx-auto">
                    <Breadcrumb pageName="제품 등록"/>
                    <div className="mb-6 flex gap-3 justify-end sm:flex-row">
                        <BackButton/>
                        <button type="submit" className="inline-flex items-center rounded justify-center gap-2.5 bg-primary px-8 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-8">
                            제출하기
                        </button>
                    </div>

                    <div className="grid grid-cols-1 gap-9">
                        <div className="flex flex-col gap-9">
                            <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
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
                                            className="w-full rounded border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                                        />
                                    </div>
                                    <div className="mb-4.5">
                                        <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            판매상태 <span className="text-meta-1">*</span>
                                        </label>
                                        <RadioButton options={salesOptions} name="salesStatus"/>
                                    </div>

                                    <div className="mb-4.5">
                                        <Select label={"브랜드"} options={brandOptions} defaultOption={"브랜드를 선택해주세요."} name="brand"/>
                                    </div>

                                    <div className="mb-4.5">
                                        <MultiSelect label={"카테고리"} optionList={categoryOptions} id="multiSelect" name="categoryList" defaultOption={"카테고리를 선택해주세요."}/>
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

                                        <QuillEditor quillRef={quillRef} />

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