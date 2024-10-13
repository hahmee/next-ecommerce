"use client";
import Image from "next/image";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {PageResponse} from "@/interface/PageResponse";
import {Product} from "@/interface/Product";
import PageComponent from "@/components/Tables/PageComponent";
import {Paging} from "@/interface/Paging";
import AddProductButton from "@/components/Tables/AddProductButton";
import ActionButton from "@/components/Tables/ActionButton";
import FilterButton from "@/components/Tables/FilterButton";
import {DataResponse} from "@/interface/DataResponse";
import {useRouter} from "next/navigation";
import {salesOptions} from "@/components/Admin/Product/ProductForm";
import {SalesStatus} from "@/types/salesStatus";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import TableSearch from "@/components/Tables/TableSearch";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import Dialog from "@/components/Admin/Dialog";
import {EllipsisHorizontalIcon} from "@heroicons/react/20/solid";

const initalPagingData: Paging = {
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0,
    prev: false,
    next: false,
    pageNumList: [0],
}

const ProductTable = () => { //{page, size, search} : PageParam

    const [paging, setPaging] = useState<Paging>(initalPagingData);

    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [currentPno, setCurrentPno] = useState<number>(-1);
    const [productData, setProductData] = useState<PageResponse<Product>>();
    const [deleteId, setDeleteId] = useState<number>(-1);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { isFetched, isFetching, data, error, isError} = useQuery<DataResponse<PageResponse<Product>>, Object, PageResponse<Product>, [_1: string, _2: Object]>({
        queryKey: ['adminProducts', {page, size, search}],
        queryFn: () => getProductsByEmail({page, size, search}),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        throwOnError: false,
        select: (data) => {
            return data.data;
        }
    });

    const handleClick = (pno:number) => {
        router.push(`/admin/products/${pno}`);
    }

    useEffect(() => {
        setProductData(data);
        if (data) {

            const {dtoList, ...otherData} = data;
            setPaging(otherData);
        }
    }, [data]);

    const handleOpenMenu = (pno:number) => {
        setCurrentPno(pno);
    }

    const handleSearch = (value:string) => {
        setSearch(value);  // 검색어 업데이트
    };

    const changeSize = (size:number) => {
        setSize(size);
    }

    const changePage = (page:number) =>{
        setPage(page);
    }

    const mutation = useMutation({
        mutationFn: async (pno: number) => {
            return fetchWithAuth(`/api/products/${pno}`, {
                method: "DELETE",
                credentials: 'include',
            });
        },
        onSuccess: (data) => {
            console.log('data...', data);
            clickModal();

            queryClient.invalidateQueries({queryKey: ['adminProducts', {page, size, search}]});

        }

    });

    // 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
    const clickModal = () => setShowDialog(!setShowDialog);

    //삭제
    const deleteProduct = () => {
        mutation.mutate(deleteId);
    }

    return (
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            {showDialog && <Dialog content={"정말 삭제하시겠습니까?"} clickModal={clickModal} showDialog={showDialog}
                                   doAction={deleteProduct}/>}

            <div
                className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                    <TableSearch onSearch={handleSearch}/> {/* 검색어 전달 */}
                </div>
                <div
                    className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <AddProductButton/>
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        <ActionButton/>
                        <FilterButton changeSize={changeSize}/>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-6 px-4 py-4.5 bg-gray-50 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5 dark:bg-gray-700">
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">상품이름</p>
                </div>
                <div className="col-span-1 hidden items-center sm:flex">
                    <p className="font-medium">카테고리</p>
                </div>
                <div className="col-span-2 flex items-center">
                    <p className="font-medium">SKU</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">가격</p>
                </div>
                <div className="col-span-1 flex items-center">
                    <p className="font-medium">재고현황</p>
                </div>

                <div className="col-span-1 flex items-center">

                </div>
            </div>

            {productData?.dtoList?.map((product, key) => (
                <div
                    className="grid grid-cols-6 border-b border-stroke px-4 py-3 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
                    key={key}
                >
                    <div className="col-span-2 flex items-center">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                                {
                                    (product.uploadFileNames && product.uploadFileNames.length > 0) &&
                                    <Image
                                        src={product.uploadFileNames[0]?.file}
                                        width={500}
                                        height={500}
                                        className="object-cover w-15 h-10 "
                                        alt="Product"
                                        onClick={() => handleClick(product.pno)}
                                    />
                                }
                            <p className="text-sm text-black dark:text-white">
                                {product.pname}
                            </p>
                        </div>
                    </div>
                    <div className="col-span-1 hidden sm:flex flex-col items-start justify-center">
                            <span className="bg-primary-100 text-primary-800 text-xs px-1.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                                {product.category?.cname}
                            </span>
                    </div>
                    <div className="col-span-2 flex items-center">
                        <p className="text-sm text-black dark:text-white">
                            {product.sku}
                        </p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <p className="text-sm text-black dark:text-white">{(product.price).toLocaleString()} 원</p>
                    </div>
                    <div className="col-span-1 flex items-center">
                        <div
                            className={`inline-block w-4 h-4 mr-2 rounded-full ${product.salesStatus === SalesStatus.ONSALE ? "bg-green-400" : product.salesStatus === SalesStatus.STOPSALE ? "bg-red" : "bg-yellow-300"}`}></div>
                        <p className="text-sm text-black dark:text-white">{salesOptions.find(option => option.id === product.salesStatus)?.content}</p>
                    </div>
                    <div className="col-span-1 flex items-center justify-end relative">
                        <button id="apple-imac-27-dropdown-button" data-dropdown-toggle="apple-imac-27-dropdown"
                                className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                                type="button" onClick={() => handleOpenMenu(product.pno)}>
                            <EllipsisHorizontalIcon className="h-6 w-6"/>
                        </button>

                        {
                            currentPno === product.pno && (
                                <div id="apple-imac-27-dropdown" className="absolute z-10 w-44 top-12 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                    <ul className="py-1 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="apple-imac-27-dropdown-button">
                                        <li>
                                            <Link href={`/product/${product.pno}`}
                                                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">상품보기</Link>
                                        </li>
                                        <li>
                                            <Link href={`/admin/products/${product.pno}`}
                                                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">수정하기</Link>
                                        </li>
                                    </ul>
                                    <div className="py-1">
                                        <div
                                            className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                                            onClick={() => {
                                                setShowDialog(true);
                                                setDeleteId(product.pno);
                                            }}>
                                            삭제하기
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            ))}

            <div className="px-4 py-6 md:px-6 xl:px-7.5">
                <PageComponent pagingData={paging} size={size} search={search} changePage={changePage}/>
            </div>
        </div>
    );
};

export default ProductTable;
