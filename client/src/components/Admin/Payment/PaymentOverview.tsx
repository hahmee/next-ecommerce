"use client";

import React, {useState} from "react";
import {Option} from "@/interface/Option";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import ClickOutside from "@/components/Common/ClickOutside";
import {useQuery} from "@tanstack/react-query";
import {PaymentSummaryDTO} from "@/interface/PaymentSummaryDTO";
import {getPaymentsOverview} from "@/apis/adminAPI";
import formatDate from "@/libs/formatDate";


const PaymentOverview = () => {

    const endDate = new Date(); // 기본 값: 30일
    const startDate = new Date();  // 기본 값: 30일
    startDate.setDate(startDate.getDate() - 30); // 오늘 기준으로 30일 전

    const [date, setDate] = useState({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
    });

    const getDateRange = (days: number) => {
        const today = new Date();
        const endDate = formatDate(today);
        const startDate = formatDate(new Date(today.setDate(today.getDate() - days + 1)));
        return {startDate, endDate};
    }

    const paymentMenuOption: Array<Option<string>> = [
        {id: "last30days", content: '지난 30일', ...getDateRange(30)}, // 기본 값
        {id: "last7days", content: '지난 7일', ...getDateRange(7)},
        {id: "last90days", content: '지난 90일', ...getDateRange(90)},
        {id: "today", content: '오늘', startDate: formatDate(new Date()), endDate: formatDate(new Date())},
        {id: "all", content: '전체 기간', startDate: "", endDate: ""},
    ];

    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [menuValue, setMenuValue] = useState<Option<string>>(paymentMenuOption[0]);

    const {
        isFetched,
        isFetching,
        data: paymentSummary,
        error,
        isError
    } = useQuery<PaymentSummaryDTO, Object, PaymentSummaryDTO, [_1: string, _2: Object]>({
        queryKey: ['adminPaymentOverview', {date}],
        queryFn: () => getPaymentsOverview({
            startDate: date.startDate,
            endDate: date.endDate,
        }),
        // queryFn: async () => {
        //     throw new Error("강제로 에러 발생!");
        // },
        staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
        gcTime: 300 * 1000,
        throwOnError: true,
        retry: 1,            // 최소 1 이상이어야 재시도됨

    });

    const handleDateClick = (option: Option<string>) => {
        setMenuValue(option);
        setShowMenu(false);
        setDate({startDate: option.startDate || "", endDate: option.endDate || ""});
    };


    return (
        <div
            className="grid grid-cols-2 grid-rows-[auto,1fr] divide-y rounded-sm border shadow-default dark:border-strokedark dark:bg-boxdark bg-white">
            <div className="pl-7.5 py-3 col-span-2 font-semibold text-lg flex items-center relative">
                <div>개요:</div>

                <div className="cursor-pointer font-semibold underline px-2 text-center inline-flex items-center"
                     onClick={() => setShowMenu(!showMenu)}>
                    {menuValue.content}
                    <ChevronDownIcon className="ml-2 h-5 w-5"/>
                </div>

                {
                    showMenu &&
                    <ClickOutside onClick={() => setShowMenu(false)}>
                        <div
                            className="z-99 absolute top-12 left-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                {
                                    paymentMenuOption.map((option: Option<string>) => (
                                        <li key={option.id}>
                                            <div
                                                className={`block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${option.id === menuValue.id ? "bg-primary-500 text-white" : ""}`}
                                                onClick={() => handleDateClick(option)}
                                            >{option.content}</div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </ClickOutside>
                }


            </div>
            <div className="border-r flex flex-col gap-2 p-7.5"> {/* 최대 높이를 설정 */}
                <div className="font-normal text-sm">총 금액</div>
                <div className="font-semibold text-base">{paymentSummary?.totalAmount.toLocaleString()} 원</div>
            </div>
            <div className="flex flex-col gap-2 p-7.5">
                <div className="font-normal text-sm">결제 완료</div>
                <div className="font-semibold text-base">{paymentSummary?.count.toLocaleString()} 건</div>
            </div>
        </div>
    );
};

export default PaymentOverview;
