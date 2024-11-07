"use client";
import {useQuery} from "@tanstack/react-query";
import {PageResponse} from "@/interface/PageResponse";
import PageComponent from "@/components/Tables/PageComponent";
import {Paging} from "@/interface/Paging";
import ViewButton from "@/components/Tables/ViewButton";
import {DataResponse} from "@/interface/DataResponse";
import React, {useEffect, useState} from "react";
import TableSearch from "@/components/Tables/TableSearch";
import {Payment} from "@/interface/Payment";
import {initalPagingData} from "@/components/Tables/ProductTable";
import {TossPaymentStatusKR, TossPaymentTypeKR} from "@/types/toss";
import TableDatePicker from "@/components/Admin/TableDatePicker";
import {getPaymentsByEmail} from "@/api/adminAPI";


const PaymentTable = () => {

    const endDate = new Date(); // today
    const startDate = new Date();  // today

    const [date, setDate] = useState({
        startDate: startDate.toISOString().split("T")[0], // format as YYYY-MM-DD
        endDate: endDate.toISOString().split("T")[0], // format as YYYY-MM-DD
    });

    const [paging, setPaging] = useState<Paging>(initalPagingData);

    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(10);
    const [search, setSearch] = useState<string>("");
    const [payments,setPayments] = useState<PageResponse<Payment>>();

    const { isFetched, isFetching, data, error, isError} = useQuery<DataResponse<PageResponse<Payment>>, Object, PageResponse<Payment>, [_1: string, _2: Object]>({
        queryKey: ['adminPayments', {page, size, search, date}],
        queryFn: () => getPaymentsByEmail({page, size, search, startDate: date.startDate, endDate: date.endDate}),
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        // 🚀 오직 서버 에러만 에러 바운더리로 전달된다.
        // throwOnError: (error) => error. >= 500,
        throwOnError: true,
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


    const dateChange = (value:any) => {

        // value.startDate와 value.endDate를 Date 객체로 변환
        const startDate = new Date(value.startDate);
        const endDate = new Date(value.endDate);

        // YYYY-MM-DD 형식으로 변환
        const formattedStartDate = startDate.toISOString().split("T")[0];
        const formattedEndDate = endDate.toISOString().split("T")[0];

        // 두 날짜 간의 차이를 밀리초 단위로 계산
        const timeDifference = endDate.getTime() - startDate.getTime();
        // 밀리초를 일 단위로 변환 (1일 = 24시간 * 60분 * 60초 * 1000밀리초)
        const dayDifference = timeDifference / (1000 * 60 * 60 * 24); // 일 단위 차이

        // 새로운 날짜 계산
        const newEndDate = new Date(startDate); // endDate 복사
        newEndDate.setDate(startDate.getDate() - 1); // 1일 빼기

        const newStartDate = new Date(newEndDate); // newEndDate 복사
        newStartDate.setDate(newEndDate.getDate() - dayDifference); // 차이만큼 날짜 빼기

        // 날짜 객체 설정
        const date = {
            startDate: formattedStartDate,
            endDate: formattedEndDate,
        };

        setDate(date);
    };

    return (
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm mt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                <div className="w-full md:w-auto  font-semibold text-base pl-4">
                    전체 결제
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">

                    <TableDatePicker date={date} dateChange={dateChange}/>

                    <TableSearch onSearch={handleSearch}/> {/* 검색어 전달 */}
                    <div className="flex items-center space-x-3 w-full md:w-auto">
                        {/*<FilterButton/>*/}
                        <ViewButton changeSize={changeSize}/>
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
                        <th scope="col" className="px-4 py-3">Payments Type</th>
                        <th scope="col" className="px-4 py-3">Status</th>
                        <th scope="col" className="px-4 py-3">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {payments?.dtoList?.map((payment, key) => (
                        <tr className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700" key={key}>
                            <th scope="row"
                                className="pl-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-80">
                                    {new Date(payment.createdAt).toLocaleString("ko-KR", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                        hour12: true
                                    })}
                                </p>
                            </th>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-80">
                                    {payment.owner.email}
                                </p>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                {payment.orderName}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                    className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">{payment.method}</span>

                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                    className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">{TossPaymentTypeKR[payment.type]}</span>

                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                                <span
                                    className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">{TossPaymentStatusKR[payment.status]}</span>

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
