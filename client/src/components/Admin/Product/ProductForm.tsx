"use client";

import React, {FormEvent, useCallback, useRef} from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ImageUploadForm, {ImageType} from "@/components/Admin/Product/ImageUploadForm";
import MultiSelect from "@/components/Admin/Product/MultiSelect";
import {Option} from "@/interface/Option";
import BackButton from "@/components/Admin/Product/BackButton";
import {useMutation, useQuery} from "@tanstack/react-query";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import {useProductImageStore} from "@/store/productImageStore";
import toast from "react-hot-toast";
import {SalesStatus} from "@/types/salesStatus";
import {DataResponse} from "@/interface/DataResponse";
import {Product} from "@/interface/Product";
import {getProduct} from "@/app/(admin)/admin/products/[id]/_lib/getProduct";
import {Size} from "@/types/size";
import {useTagStore} from "@/store/tagStore";
import TagSelect from "@/components/Admin/Product/TagSelect";
import RadioButton from "@/components/Admin/Product/RadioButton";
import Select from "@/components/Admin/Product/Select";
import QuillEditor from "@/components/Admin/Product/QuillEditor";
import {Mode} from "@/types/mode";
import CategorySelect from "@/components/Admin/Product/CategorySelect";
import {Category} from "@/interface/Category";
import {getCategories} from "@/app/(admin)/admin/products/_lib/getCategories";

export const brandOptions:  Array<Option<string>> = [
    {id: 'brand-option1', content:'브랜드 옵션1'},
    {id: 'brand-option2', content:'브랜드 옵션2'},
    {id: 'brand-option3', content:'브랜드 옵션3'},
];
export const categoryOptions: Array<Option<string>> = [
    {id:'(.)category-option1', content:'카테고리 옵션1'},
    {id:'(.)category-option2', content:'카테고리 옵션2'},
    {id:'(.)category-option3', content:'카테고리 옵션3'},
]

export const sizeOptions: Array<Option<string>> = [
    {id: Size.XS, content: 'XS'},
    {id: Size.S, content: 'S'},
    {id: Size.M, content: 'M'},
    {id: Size.L, content: 'L'},
    {id: Size.XL, content: 'XL'},
    {id: Size.XXL, content: '2XL'},
    {id: Size.XXXL, content: '3XL'},
    {id: Size.FREE, content: 'FREE'},
];

export const salesOptions: Array<Option<SalesStatus>> = [
    {id: SalesStatus.ONSALE, content:'판매중'},
    {id: SalesStatus.SOLDOUT, content:'재고없음'},
    {id: SalesStatus.STOPSALE, content:'판매중지'},
];

interface Props {
    type: Mode;
    id?: string;
}
const categories1 = [
    { id: 1, name: 'Fashion', subcategories: ['Clothing', 'Accessories', 'Footwear'] },
    { id: 2, name: 'Electronics', subcategories: ['Mobile Phones', 'Laptops', 'Headphones'] },
    { id: 3, name: 'Home & Living', subcategories: ['Furniture', 'Decor', 'Kitchenware'] },
    // Add more categories as needed
];

const ProductForm = ({type, id}: Props) => {
    console.log('type', type);
    const productImageStore = useProductImageStore();
    const tagStore = useTagStore();

    //type 변경하기
    const quillRef = useRef<any>(null);

    // edit일 때만 getProduct하기
    const {isLoading, data: originalData, error} = useQuery<DataResponse<Product>, Object, Product, [_1: string, _2: string]>({
        queryKey: ['productSingle', id!],
        queryFn: getProduct,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        enabled: !!id && type === Mode.EDIT, // id가 존재할 때만 쿼리 요청 실행(modify일때만)
        select: useCallback((data: DataResponse<Product>) => {

            const uploadFileNames = data.data.uploadFileNames?.map((name, idx) => {

                return { dataUrl:name.file, file: undefined , uploadKey: data.data.uploadFileKeys?.[idx].file, id:name.ord} as ImageType;
            });

            productImageStore.setFiles(uploadFileNames || []);

            return data.data;
        }, []),

    });

    //카테고리 가져오기
    const { isFetched:ctIsFetched, isFetching:ctIsFetching, data:categories, error:ctError, isError:ctIsError} = useQuery<DataResponse<Array<Category>>, Object, Array<Category>>({
        queryKey: ['categories'],
        queryFn: () => getCategories(),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: false,
        select: (data) => {
            // 데이터 가공 로직만 처리
            return data.data;
        }
    });

    console.log('categories', categories);

    const mutation = useMutation({
        mutationFn: async (e: FormEvent) => {
            e.preventDefault();
            let pdesc = "";

            if (quillRef.current) {
                pdesc = quillRef?.current?.value;
            }
            if (type === Mode.ADD) {

                console.log('tagStore', tagStore.tags);
                const formData = new FormData(e.target as HTMLFormElement);

                formData.append("pdesc", pdesc);

                // formData.append("colorList", tagStore.tags as any);
                tagStore.tags.forEach((t, index) => {

                    formData.append(`colorList[${index}].text`, t.text);
                    formData.append(`colorList[${index}].color`, t.color);

                });

                productImageStore.files.forEach((p,index) => {

                    formData.append(`files[${index}].file`, p.file!); // 실제 파일 객체
                    formData.append(`files[${index}].ord`, index.toString()); // 파일 순서

                });


                return fetchWithAuth(`/api/products/`, {
                    method: "POST",
                    credentials: 'include',
                    body: formData as FormData,
                }); // json 형태로 이미 반환

            } else {

                const formData = new FormData(e.target as HTMLFormElement);

                formData.append("pdesc", pdesc);

                // formData.append("colorList", tagStore.tags as any);
                tagStore.tags.forEach((t, index) => {

                    formData.append(`colorList[${index}].text`, t.text);
                    formData.append(`colorList[${index}].color`, t.color);

                });

                console.log('productImageStore.files', productImageStore.files);

                let newFileIdx = 0;
                let uploadIdx = 0;
                //새로 업로드한 파일들
                productImageStore.files.forEach((p, index) => {

                    if (p.file === undefined) {  // 이전에 올렸던 파일들 중 살릴 것들 (삭제 안 한 것들)

                        formData.append(`uploadFileNames[${uploadIdx}].file`, p.dataUrl); // 실제 파일 객체
                        formData.append(`uploadFileNames[${uploadIdx}].ord`, index.toString()); // 파일 순서
                        formData.append(`uploadFileKeys[${uploadIdx}].file`, p.uploadKey!); // 실제 파일 객체
                        formData.append(`uploadFileKeys[${uploadIdx}].ord`, index.toString()); // 파일 순서

                        uploadIdx++;
                    } else { // 새로 올릴거
                        formData.append(`files[${newFileIdx}].file`, p.file!); // 실제 파일 객체
                        formData.append(`files[${newFileIdx}].ord`, index.toString()); // 파일 순서
                        newFileIdx++;
                    }

                });


                return fetchWithAuth(`/api/products/${id}`, {
                    method: "PUT",
                    credentials: 'include',
                    body: formData as FormData,
                    // headers: { 'Content-Type': 'multipart/form-data' }
                }); // json 형태로 이미 반환
            }


        },
        async onSuccess(response, variable) {

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
                    <Breadcrumb pageName={type === Mode.ADD ? "제품 등록" : "제품 수정"}/>
                    <div className="mb-6 flex gap-3 justify-end sm:flex-row">
                        <BackButton/>
                        <button type="submit"
                                className="inline-flex items-center rounded justify-center gap-2.5 bg-primary-700 px-8 py-3 text-center font-medium text-white hover:bg-opacity-90 lg:px-6 xl:px-8">
                            {
                                type === Mode.ADD ? "저장하기" : "수정하기"
                            }
                        </button>
                    </div>


                    <div className="grid grid-cols-1 gap-9">
                        <div className="flex flex-col gap-9">
                            <div
                                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                {/*<div*/}
                                {/*    className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">*/}
                                {/*    <h3 className="font-medium text-black dark:text-white">*/}
                                {/*        이미지*/}
                                {/*    </h3>*/}
                                {/*</div>*/}

                                {/*<div className="max-w-4xl mx-auto p-4">*/}
                                {/*    <h1 className="text-2xl font-bold mb-4">Choose a Category</h1>*/}
                                {/*    <div className="flex space-x-4">*/}
                                {/*        {categories1.map((category) => (*/}
                                {/*            <div key={category.id} className="bg-white shadow-md rounded-md w-64">*/}
                                {/*                /!*<div className="flex justify-between items-center p-4 border-b">*!/*/}
                                {/*                /!*    <span className="font-semibold">{category.name}</span>*!/*/}
                                {/*                /!*    <button className="text-blue-500">Select</button>*!/*/}
                                {/*                /!*</div>*!/*/}
                                {/*                <ul className="p-2 space-y-2">*/}
                                {/*                    {category.subcategories.map((sub) => (*/}
                                {/*                        <li key={sub} className="flex justify-between items-center">*/}
                                {/*                            <span>{sub}</span>*/}
                                {/*                            <button className="text-blue-500">Select</button>*/}
                                {/*                        </li>*/}
                                {/*                    ))}*/}
                                {/*                </ul>*/}
                                {/*            </div>*/}
                                {/*        ))}*/}
                                {/*    </div>*/}
                                {/*</div>*/}

                                <div className="overflow-x-auto p-6.5">
                                    <div className="mb-6">
                                        {/*<div className="bg-amber-700  w-full min-w-96">*/}
                                        {/*    <div className="">*/}
                                        {/*        asdfasd*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                        <CategorySelect categories={categories || []}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-9">
                            <div
                                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div
                                    className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        이미지
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
                                <div
                                    className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        기본정보
                                    </h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="mb-4.5">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white">
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
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            판매상태 <span className="text-meta-1">*</span>
                                        </label>
                                        <RadioButton options={salesOptions} name="salesStatus"
                                                     originalData={originalData?.salesStatus}/>
                                    </div>

                                    <div className="mb-4.5">
                                        <Select label={"브랜드"} options={brandOptions}
                                                defaultOption={"브랜드를 선택해주세요."}
                                                originalData={originalData?.brand}
                                                name="brand"/>
                                    </div>

                                    <div className="mb-4.5">
                                        <MultiSelect label={"카테고리"} optionList={categoryOptions}
                                                     id="multiSelect"
                                                     originalData={originalData?.categoryList}
                                                     name="categoryList"
                                                     defaultOption={"카테고리를 선택해주세요."}/>
                                    </div>

                                    <div className="mb-4.5">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white">
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
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white">
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
                                        옵션정보
                                    </h3>
                                </div>
                                <div className="p-6.5">
                                    <div className="mb-4.5">
                                        <MultiSelect label={"사이즈"}
                                                     optionList={sizeOptions}
                                                     id="multiSizeSelect"
                                                     originalData={originalData?.sizeList}
                                                     name="sizeList"
                                                     defaultOption={"사이즈를 선택해주세요."}/>
                                    </div>
                                    <div className="mb-4.5">
                                        <TagSelect label={"컬러"}
                                                   originalData={originalData?.colorList}
                                                   defaultOption={"컬러를 선택해주세요."}/>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-9">
                            <div
                                className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                                <div
                                    className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                    <h3 className="font-medium text-black dark:text-white">
                                        상품 상세
                                    </h3>
                                </div>
                                <div className="p-6.5">

                                    <div className="mb-6">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white">
                                            상품 설명 <span className="text-meta-1">*</span>
                                        </label>

                                        <QuillEditor quillRef={quillRef}
                                                     originalData={originalData?.pdesc}/>

                                    </div>

                                    <div className="mb-6">
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white">
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
                                        <label
                                            className="mb-3 block text-sm font-medium text-black dark:text-white">
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