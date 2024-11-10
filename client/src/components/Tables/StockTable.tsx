"use client";
import Image from "next/image";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {PageResponse} from "@/interface/PageResponse";
import {Product} from "@/interface/Product";
import PageComponent from "@/components/Tables/PageComponent";
import {Paging} from "@/interface/Paging";
import ViewButton from "@/components/Tables/ViewButton";
import {DataResponse} from "@/interface/DataResponse";
import {useRouter} from "next/navigation";
import {salesOptions} from "@/components/Admin/Product/ProductForm";
import React, {useCallback, useEffect, useState} from "react";
import TableSearch from "@/components/Tables/TableSearch";
import {fetchJWT} from "@/utils/fetchJWT";
import TableActions from "@/components/Tables/TableActions";
import Link from "next/link";
import Select from "@/components/Admin/Product/Select";
import toast from "react-hot-toast";
import {getProductsByEmail} from "@/api/adminAPI";
import {Category} from "@/interface/Category";

export const initalPagingData: Paging = {
    totalCount: 0,
    prevPage: 0,
    nextPage: 0,
    totalPage: 0,
    current: 0,
    prev: false,
    next: false,
    pageNumList: [0],
}


const StockTable = () => {

    const [paging, setPaging] = useState<Paging>(initalPagingData);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [productData, setProductData] = useState<PageResponse<Product>>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { isFetched, isFetching, data, error, isError} = useQuery<DataResponse<PageResponse<Product>>, Object, PageResponse<Product>, [_1: string, _2: Object]>({
        queryKey: ['adminStockProducts', {page, size, search}],
        queryFn: () => getProductsByEmail({page, size, search}),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        throwOnError: true,
        select: (data) => {
            return data.data;
        }
    });

    console.log('data', data);

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
        mutationFn: async ({ salesStatus, pno }: { salesStatus: string; pno: number }) => {
            const response = await fetchJWT(`/api/products/stock/${pno}`, {
                method: "PUT",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ salesStatus, pno }),
            });
            console.log('response', response);
        },
        onSuccess: async (response) => {
            console.log('data...', response);
            toast.success("수정되었습니다.");

            if (queryClient.getQueryData(['adminStockProducts', {page, size, search}])) {
                queryClient.setQueryData(['adminStockProducts', {page, size, search}], (prevData: { data: { dtoList: Product[] } }) => {
                    console.log('prevData', prevData);

                });
              }
            },
        onError: async (error) => {

            toast.error(`오류 발생: ${error}`);
        },

    });


// Select에서 선택한 값을 받아와 사용할 함수
    const handleSelectChange = useCallback((value: string, id: number) => {
        mutation.mutate({ salesStatus: value, pno: id });
    }, [mutation]);

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm">
            <div
                className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                    <TableSearch onSearch={handleSearch}/> {/* 검색어 전달 */}
                </div>
                <div
                    className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        {/*<FilterButton/>*/}
                        <ViewButton changeSize={changeSize}/>
                    </div>
                </div>
            </div>

            <div className="w-auto overflow-x-auto overflow-y-hidden ">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">상품이름</th>
                        <th scope="col" className="px-4 py-3">SKU</th>
                        <th scope="col" className="px-4 py-3">재고</th>
                        <th scope="col" className="px-4 py-3">
                            <span className="sr-only">Actions</span>
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {productData?.dtoList?.map((product, key) => (
                        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" key={key}>
                            <th scope="row"
                                className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <Link href={`/admin/products/${product.pno}`} className="flex items-center gap-2">
                                    {(product.uploadFileNames && product.uploadFileNames.length > 0) &&
                                        <Image
                                            src={product.uploadFileNames[0]?.file}
                                            width={500}
                                            height={500}
                                            className="object-cover rounded-full w-12 h-12 flex-none"
                                            alt="Product"
                                            onClick={() => handleClick(product.pno)}
                                        />
                                    }
                                    <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap w-full">
                                        {product.pname}
                                    </p>
                                </Link>
                            </th>
                            <td className="px-4 py-3 whitespace-nowrap">
                                {product.sku}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <Select options={salesOptions}
                                        originalData={product.salesStatus}
                                        name="stock"
                                        doAction={(value: string) => handleSelectChange(value, product.pno)}
                                />
                            </td>

                            <td className="px-4 py-3 justify-end whitespace-nowrap">
                                <TableActions>
                                    <div id="apple-imac-27-dropdown"
                                         className="absolute w-44 right-0 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600">
                                        <ul className="py-1 text-sm text-gray-700 dark:text-gray-200"
                                            aria-labelledby="apple-imac-27-dropdown-button">
                                            <li>
                                                <Link href={`/product/${product.pno}`}
                                                      className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">상품보기</Link>
                                            </li>
                                            <li>
                                                <Link href={`/admin/products/${product.pno}`}
                                                      className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">제품정보
                                                    편집</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </TableActions>

                            </td>
                        </tr>
                    ))}

                    </tbody>
                </table>


            </div>

            <div className="px-4 py-6 md:px-6 xl:px-7.5">
                <PageComponent pagingData={paging} size={size} search={search} changePage={changePage}/>
            </div>
        </div>
    );
};

export default StockTable;
