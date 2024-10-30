"use client";
import Image from "next/image";
import {getProductsByEmail} from "@/app/(admin)/admin/products/_lib/getProductsByEmail";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {PageResponse} from "@/interface/PageResponse";
import {Product} from "@/interface/Product";
import PageComponent from "@/components/Tables/PageComponent";
import {Paging} from "@/interface/Paging";
import TableAddButton from "@/components/Tables/TableAddButton";
import ActionButton from "@/components/Tables/ActionButton";
import FilterButton from "@/components/Tables/FilterButton";
import {DataResponse} from "@/interface/DataResponse";
import {useRouter} from "next/navigation";
import {brandOptions, salesOptions} from "@/components/Admin/Product/ProductForm";
import {SalesStatus} from "@/types/salesStatus";
import React, {useCallback, useEffect, useState} from "react";
import TableSearch from "@/components/Tables/TableSearch";
import {fetchWithAuth} from "@/utils/fetchWithAuth";
import Dialog from "@/components/Admin/Dialog";
import {StarIcon} from "@heroicons/react/20/solid";
import TableActions from "@/components/Tables/TableActions";
import Link from "next/link";
import Select from "@/components/Admin/Product/Select";
import {Option} from "@/interface/Option";

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
    const [currentPno, setCurrentPno] = useState<number>(-1);
    const [productData, setProductData] = useState<PageResponse<Product>>();
    const [deleteId, setDeleteId] = useState<number>(-1);
    const [selectedValue,setSelectedValue] = useState<string>("");
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { isFetched, isFetching, data, error, isError} = useQuery<DataResponse<PageResponse<Product>>, Object, PageResponse<Product>, [_1: string, _2: Object]>({
        queryKey: ['adminStockProducts', {page, size, search}],
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

    // Select에서 선택한 값을 받아와 사용할 함수
    const handleSelectChange = useCallback(async (value: string, id:number) => {

        setSelectedValue(value);
        console.log("선택된 값:", value);

        const
        // 필요한 추가 작업 수행

        await fetchWithAuth(`/api/products/stock/${id}`, {
            method: "PUT",
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(value),
        }); // json 형태로 이미 반환

        //알림창


    }, [setSelectedValue]);

    return (
        // <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm overflow-hidden">
            {showDialog && <Dialog content={"정말 삭제하시겠습니까?"} clickModal={clickModal} showDialog={showDialog}
                                   doAction={deleteProduct}/>}

            <div
                className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2">
                    <TableSearch onSearch={handleSearch}/> {/* 검색어 전달 */}
                </div>
                <div
                    className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <TableAddButton content={"Add Product"} location={"/admin/products/add-product"}/>
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        <ActionButton/>
                        <FilterButton changeSize={changeSize}/>
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
                                            className="object-cover w-15 h-10 flex-none"
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
