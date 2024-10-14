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
import {getPaymentsByEmail} from "@/app/(admin)/admin/order/_lib/getPaymentsByEmail";
import {Payment} from "@/interface/Payment";

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

const OrderTable = () => {

    const [paging, setPaging] = useState<Paging>(initalPagingData);

    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [currentPno, setCurrentPno] = useState<number>(-1);
    const [payments,setPayments] = useState<PageResponse<Payment>>();
    const [deleteId, setDeleteId] = useState<number>(-1);
    const [showDialog, setShowDialog] = useState<boolean>(false);
    const router = useRouter();
    const queryClient = useQueryClient();

    const { isFetched, isFetching, data, error, isError} = useQuery<DataResponse<PageResponse<Payment>>, Object, PageResponse<Payment>, [_1: string, _2: Object]>({
        queryKey: ['adminPayments', {page, size, search}],
        queryFn: () => getPaymentsByEmail({page, size, search}),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        throwOnError: false,
        select: (data) => {
            return data.data;
        }
    });

    console.log('payments..', data);

    useEffect(() => {
        setPayments(data);
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

    // 버튼 클릭시 모달 버튼 클릭 유무를 설정하는 state 함수
    const clickModal = () => setShowDialog(!setShowDialog);


    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm overflow-hidden">
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

            <div className="w-auto overflow-x-auto overflow-y-hidden relative">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 relative">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-4 py-3">Order</th>
                        <th scope="col" className="px-4 py-3">Order Name</th>
                        <th scope="col" className="px-4 py-3">Date created</th>
                        <th scope="col" className="px-4 py-3">Customer</th>
                        <th scope="col" className="px-4 py-3">Fulfillment</th>
                        <th scope="col" className="px-4 py-3">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments?.dtoList?.map((payment, key) => (
                        <tr className="border-b dark:border-gray-700" key={key}>
                            <th scope="row" className="pl-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-80">
                                    #{payment.orderId}
                                </p>
                            </th>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-80">
                                    {payment.orderName}
                                </p>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span className="bg-primary-100 text-primary-800 text-xs px-1.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">{new Date(payment.createdAt).toLocaleDateString()}</span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">{payment.owner.email}</td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                    className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{payment.status}</span>

                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">{(payment.totalAmount).toLocaleString()} 원</td>
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

export default OrderTable;
