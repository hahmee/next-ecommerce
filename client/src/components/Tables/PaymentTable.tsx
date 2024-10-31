"use client";
import {useQuery} from "@tanstack/react-query";
import {PageResponse} from "@/interface/PageResponse";
import PageComponent from "@/components/Tables/PageComponent";
import {Paging} from "@/interface/Paging";
import TableAddButton from "@/components/Tables/TableAddButton";
import ActionButton from "@/components/Tables/ActionButton";
import FilterButton from "@/components/Tables/FilterButton";
import {DataResponse} from "@/interface/DataResponse";
import React, {useEffect, useState} from "react";
import TableSearch from "@/components/Tables/TableSearch";
import {getPaymentsByEmail} from "@/app/(admin)/admin/order/_lib/getPaymentsByEmail";
import {Payment} from "@/interface/Payment";
import {initalPagingData} from "@/components/Tables/ProductTable";


const PaymentTable = () => {

    const [paging, setPaging] = useState<Paging>(initalPagingData);

    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [payments,setPayments] = useState<PageResponse<Payment>>();

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


    const handleSearch = (value:string) => {
        setSearch(value);  // 검색어 업데이트
    };

    const changeSize = (size:number) => {
        setSize(size);
    }

    const changePage = (page:number) =>{
        setPage(page);
    }

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm overflow-hidden mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-1/2 font-semibold pl-4">
                    전체 결제
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    <TableSearch onSearch={handleSearch}/> {/* 검색어 전달 */}
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
                        <th scope="col" className="px-4 py-3">Date</th>
                        <th scope="col" className="px-4 py-3">Customer</th>
                        <th scope="col" className="px-4 py-3">Product/Service</th>
                        <th scope="col" className="px-4 py-3">Payments Method</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments?.dtoList?.map((payment, key) => (
                        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" key={key}>
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

export default PaymentTable;
