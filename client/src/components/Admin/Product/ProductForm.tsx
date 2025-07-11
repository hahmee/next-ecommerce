"use client";

import React, {FormEvent, useEffect, useRef, useState} from "react";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import ImageUploadForm, {ImageType} from "@/components/Admin/Product/ImageUploadForm";
import MultiSelect from "@/components/Admin/Product/MultiSelect";
import {Option} from "@/interface/Option";
import BackButton from "@/components/Admin/Product/BackButton";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useProductImageStore} from "@/store/productImageStore";
import toast from "react-hot-toast";
import {SalesStatus} from "@/types/salesStatus";
import {Product} from "@/interface/Product";
import {Size} from "@/types/size";
import {useTagStore} from "@/store/tagStore";
import ColorSelector from "@/components/Admin/Product/ColorSelector";
import RadioButton from "@/components/Admin/Product/RadioButton";
import QuillEditor from "@/components/Admin/Product/QuillEditor";
import {Mode} from "@/types/mode";
import CategorySelect from "@/components/Admin/Product/CategorySelect";
import {Category} from "@/interface/Category";
import Link from "next/link";
import {getCategoryPaths, getProduct} from "@/apis/adminAPI";
import {useRouter} from "next/navigation";
import {clientFetcher} from "@/utils/fetcher/clientFetcher";
import {fetcher} from "@/utils/fetcher/fetcher";

// export const brandOptions:  Array<Option<string>> = [
//     {id: 'brand-option1', content:'브랜드 옵션1'},
//     {id: 'brand-option2', content:'브랜드 옵션2'},
//     {id: 'brand-option3', content:'브랜드 옵션3'},
// ];

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

const ProductForm = ({type, id}: Props) => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const productImageStore = useProductImageStore();
    const tagStore = useTagStore();
    //최하위 카테고리
    const [leafCategory, setLeafCategory] = useState<Category|null>();
    //type 변경하기
    const quillRef = useRef<any>(null);
    // edit일 때만 getProduct하기
    const { isLoading, data: originalData } = useQuery<Product, Object, Product, [_1: string, _2: string]>(
        {
            queryKey: ["productSingle", id!],
            queryFn: getProduct,
            staleTime: 60 * 1000,
            gcTime: 300 * 1000,
            throwOnError: true,
            enabled: !!id && type === Mode.EDIT
        }
    );


    const [pdesc, setPdesc] = useState(originalData?.pdesc || '');

    // 선택했던 카테고리들을 가져온다.
    const {isLoading: isPathLoading, data: categoryPaths, error: pathError} = useQuery<Category[], Object, Category[], [_1: string, _2: string]>({
        queryKey: ['categoryPaths', originalData ? originalData.categoryId.toString() : '-1'],
        queryFn: getCategoryPaths,
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        throwOnError: true,
        enabled: !!id && type === Mode.EDIT,
    });

    //카테고리 가져오기
    const { isFetched:ctIsFetched, isFetching:ctIsFetching, data:categories, error:ctError, isError:ctIsError} = useQuery<Array<Category>, Object, Array<Category>>({
        queryKey: ['categories'],
        // queryFn: () => getCategories(),
        queryFn: () => clientFetcher("/api/category/list"),
        staleTime: 60 * 1000,
        gcTime: 300 * 1000,
        throwOnError: true, // 에러 바운더리 컴포넌트로 throw
    });

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // 기본 제출 막고
        mutation.mutate(e); // mutation 실행
    }

    const mutation = useMutation({
        mutationFn: async (e: FormEvent) => {

            if (quillRef.current) {
                setPdesc(quillRef.current.value);
            }

            if (!leafCategory) {
                throw new Error("최하단 카테고리를 선택해야합니다.");
            }

            if (productImageStore.files.length < 1) {
                throw new Error("이미지는 한 개 이상 첨부해주세요.");
            }

            const formData = new FormData(e.target as HTMLFormElement);
            const maxSize = 10 * 1024 * 1024; // 10MB

            // 각 파일의 크기를 체크
            for (const file of productImageStore.files) {
                if (file && file.size !== undefined && file.size > maxSize) {
                    throw new Error("파일의 크기가 100MB를 초과합니다.");
                }
            }

            formData.append("pdesc", quillRef.current ? quillRef.current.value : "");
            formData.append("categoryId", leafCategory.cno.toString());
            formData.append("categoryJson", JSON.stringify(leafCategory));
            tagStore.tags.forEach((t, index) => {
                formData.append(`colorList[${index}].text`, t.text);
                formData.append(`colorList[${index}].color`, t.color);
            });

            if (type === Mode.ADD) {

                productImageStore.files.forEach((p, index) => {

                    formData.append(`files[${index}].file`, p.file!); // 실제 파일 객체
                    formData.append(`files[${index}].ord`, index.toString()); // 파일 순서

                });
                if (!formData) {
                    throw new Error('FormData is undefined');
                }
                return await fetcher(`/api/products/`, {
                    method: "POST",
                    credentials: 'include',
                    body: formData as FormData,
                }); // json 형태로 이미 반환

            } else { //수정

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
                if (!formData) {
                    throw new Error('FormData is undefined');
                }

                return await fetcher(`/api/products/${id}`, {
                    method: "PUT",
                    credentials: 'include',
                    body: formData as FormData,
                    // headers: { 'Content-Type': 'multipart/form-data' }
                }); // json 형태로 이미 반환
            }
        },
        async onSuccess(response, variable) {
            const newProduct: Product = response;

            toast.success('업로드 성공했습니다.');
            if (queryClient.getQueryData(['adminProducts', {page: 1, size: 10, search: ""}])) {
                queryClient.setQueryData(['adminProducts', {page: 1, size: 10, search: ""}], (prevData: { dtoList: Product[] }) => {
                    if (type === Mode.ADD) {
                        prevData.dtoList.unshift(newProduct);
                    }else{
                        prevData.dtoList = prevData.dtoList.map(product => product.pno === newProduct.pno ? newProduct : product);
                    }
                    return prevData; // 수정된 데이터 반환
                });
            }
            if (queryClient.getQueryData(['productSingle', newProduct.pno.toString()])) {
                queryClient.setQueryData(['productSingle', newProduct.pno.toString()], (prevData: Product) => {
                    return newProduct;
                });
            }
            router.push(`/admin/products`);
        },
        onError(error) {
            console.error(error);
            toast.error(`업로드 중 에러가 발생했습니다. ${error}`);
        }
    });

    useEffect(() => {
        if (originalData) {
            const uploadFileNames = originalData.uploadFileNames?.map((name, idx) => {
                return {
                    dataUrl: name.file,
                    file: undefined,
                    uploadKey: originalData.uploadFileKeys?.[idx].file,
                    id: name.ord
                } as ImageType;
            });
            productImageStore.setFiles(uploadFileNames || []);
            setPdesc(originalData.pdesc);
        }
    }, [originalData]);

    useEffect(() => {
        //최하단 카테고리를 저장한다.
        if(categoryPaths) {
            setLeafCategory(categoryPaths[categoryPaths.length - 1]);
        }
    }, [categoryPaths]);


    if (isLoading) return "Loading...";

    return (
        <form onSubmit={handleSubmit} data-testid="product-form">
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
                            <div
                                className="flex justify-between border-b border-stroke px-6.5 py-4 dark:border-strokedark">
                                <h3 className="font-medium text-black dark:text-white">
                                    카테고리
                                </h3>
                                <Link href="/admin/category" className="underline text-sm">카테고리 추가/변경</Link>
                            </div>
                            <div className="p-6.5 mb-6">
                                <CategorySelect categories={categories || []} setSelectedCategory={setLeafCategory} categoryPaths={categoryPaths || []}/>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-9">
                        <div
                            className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
                            <div className="border-b border-stroke px-6.5 py-4 dark:border-strokedark">
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
                                    <ColorSelector label={"컬러"}
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
                                    <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                                        상품 설명 <span className="text-meta-1">*</span>
                                    </label>

                                    <QuillEditor quillRef={quillRef} originalData={pdesc}/>

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
    );
};

export default ProductForm;