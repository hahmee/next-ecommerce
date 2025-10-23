// src/widgets/admin/payments-table/ui/PaymentTableView.tsx

﻿// src/widgets/admin/payments-table/ui/PaymentTableView.tsx



'use client';

import 'dayjs/locale/ko';

import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import React from 'react';

import type { Paging } from '@/entities/order/model/Paging';
import { TossPaymentStatusKR, TossPaymentTypeKR } from '@/entities/payment/consts/toss';
import type { Payment } from '@/entities/payment/model/types';
import type { DatepickType } from '@/shared/model/DatepickType';
import PageComponent from '@/widgets/admin/table-kit/ui/PageComponent';
import TableSearch from '@/widgets/admin/table-kit/ui/TableSearch';
import ViewButton from '@/widgets/admin/table-kit/ui/ViewButton';

const TableDatePicker = dynamic(() => import('@/widgets/admin/table-kit/ui/TableDatePicker'), {
  ssr: false,
});

export function PaymentTableView(props: {
  list: Payment[];
  paging: Paging;
  page: number;
  size: number;
  search: string;
  date: DatepickType;
  isFetching: boolean;
  handleSearch: (v: string) => void;
  changeSize: (n: number) => void;
  changePage: (n: number) => void;
  dateChange: (v: any) => void;
}) {
  const {
    list,
    paging,
    page,
    size,
    search,
    date,
    handleSearch,
    changeSize,
    changePage,
    dateChange,
  } = props;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm mt-8">
      <div className="flex flex-col space-y-3 p-4">
        <div className="w-full font-semibold text-base pl-4">전체 결제</div>
        <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
          <div className="w-full md:w-1/3">
            <TableSearch onSearch={handleSearch} placeholder="Search Product/Service name" />
          </div>
          <div className="flex w-full md:w-auto ml-auto justify-end items-center space-x-3">
            <TableDatePicker date={date} dateChange={dateChange} />
            <ViewButton changeSize={changeSize} />
          </div>
        </div>
      </div>

      <div className="w-auto overflow-x-auto overflow-y-hidden relative">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 relative">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Product/Service</th>
              <th className="px-4 py-3">Payments Method</th>
              <th className="px-4 py-3">Payments Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {list.map((p, idx) => (
              <tr
                className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                key={idx}
              >
                <th
                  scope="row"
                  className="pl-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-80">
                    {dayjs(p.createdAt).locale('ko').format('YYYY년 M월 D일 A h:mm')}
                  </p>
                </th>
                <td className="px-4 py-3 whitespace-nowrap">
                  <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-80">
                    {p.owner.email}
                  </p>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{p.orderName}</td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
                    {p.method}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-1.5 py-0.5 rounded dark:bg-yellow-900 dark:text-yellow-300">
                    {TossPaymentTypeKR[p.type]}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                    {TossPaymentStatusKR[p.status]}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{p.totalAmount.toLocaleString()} 원</td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center px-4 py-6">
                  No results
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <PageComponent pagingData={paging} size={size} search={search} changePage={changePage} />
      </div>
    </div>
  );
}
