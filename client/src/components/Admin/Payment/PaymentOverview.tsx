"use client";

import React, {useState} from "react";
import {Option} from "@/interface/Option";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import ClickOutside from "@/components/ClickOutside";

export const paymentMenuOption: Array<Option<string>> = [
    {id: "today", content: '오늘'},
    {id: "last7days", content: '지난 7일'},
    {id: "last30days", content: '지난 30일'},
    {id: "last90days", content: '지난 90일'},
    {id: "all", content: '전체 기간'},
];
const PaymentOverview = () => {
    const [showMenu, setShowMenu] = useState<boolean>(false);
    const [menuValue, setMenuValue] = useState<Option<string>>(paymentMenuOption[0]);

    return (
        <div
            className="grid grid-cols-2 grid-rows-[auto,1fr] divide-y rounded-sm border shadow-default dark:border-strokedark dark:bg-boxdark bg-white">
            <div className="pl-7.5 py-3 col-span-2 font-semibold text-lg flex items-center relative">
                <div>개요:</div>

                <div
                    className="cursor-pointer font-semibold underline px-2 text-center inline-flex items-center"
                    onClick={() => setShowMenu(!showMenu)}
                >
                    {menuValue.content}
                    <ChevronDownIcon className="ml-2 h-5 w-5"/>
                </div>

                {
                    showMenu &&
                    <ClickOutside onClick={() => setShowMenu(false)}>
                        <div className="z-99 absolute top-12 left-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                            <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                                {
                                    paymentMenuOption.map((option: Option<string>) => (
                                        <li key={option.id}>
                                            <div
                                                className={`block cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white ${option.id === menuValue.id ? "bg-primary-500 text-white" : ""}`}
                                                onClick={() => {
                                                    setMenuValue(option);
                                                    setShowMenu(false);
                                                }}
                                            >{option.content}</div>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                    </ClickOutside>
                }


            </div>
            <div className="border-r flex flex-col gap-2 p-7.5">
                <div className="font-normal text-sm">총 금액</div>
                <div className="font-semibold text-base">100원</div>
            </div>
            <div className="border-r flex flex-col gap-2 p-7.5">
                <div className="font-normal text-sm">총 금액</div>
                <div className="font-semibold text-base">100원</div>
            </div>
        </div>
    );
};

export default PaymentOverview;
