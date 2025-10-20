// src/widgets/admin/orders-table/ui/OrderTableView.tsx

'use client';

import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import dayjs from 'dayjs';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import React, { Fragment } from 'react';

import type { Paging } from '@/entities/order/model/Paging';
import type { Payment } from '@/entities/payment/model/types';
import { DatepickType } from '@/shared/model/DatepickType';
import PageComponent from '@/widgets/admin/table-kit/ui/PageComponent';
import TableSearch from '@/widgets/admin/table-kit/ui/TableSearch';
import ViewButton from '@/widgets/admin/table-kit/ui/ViewButton';

const TableDatePicker = dynamic(() => import('@/widgets/admin/table-kit/ui/TableDatePicker'), {
  ssr: false,
});

export function OrderTableView(props: {
  list: Payment[];
  paging: Paging;
  isFetching: boolean;
  page: number;
  size: number;
  search: string;
  date: DatepickType;
  expandedRows: number[];
  handleSearch: (v: string) => void;
  changeSize: (n: number) => void;
  changePage: (n: number) => void;
  toggleRow: (id: number) => void;
  dateChange: (v: any) => void;
}) {
  const {
    list,
    paging,
    page,
    size,
    search,
    date,
    expandedRows,
    isFetching,
    handleSearch,
    changeSize,
    changePage,
    toggleRow,
    dateChange,
  } = props;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="w-full md:w-1/3">
          <TableSearch onSearch={handleSearch} placeholder="Search order name or order number" />
        </div>
        <div className="flex w-full md:w-auto ml-auto justify-end items-center space-x-3">
          <TableDatePicker date={date} dateChange={dateChange} />
          <ViewButton changeSize={changeSize} />
        </div>
      </div>

      <div className="w-auto overflow-x-auto overflow-y-hidden relative">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 relative">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Order Name</th>
              <th className="px-4 py-3">Date created</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Fulfillment</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Item</th>
            </tr>
          </thead>

          <tbody>
            {list.map((payment) => (
              <Fragment key={payment.id}>
                <tr
                  className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => toggleRow(payment.id)}
                >
                  <th
                    scope="row"
                    className="pl-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    <p className="truncate flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-80">
                      {!!payment.orders?.length &&
                        (expandedRows.includes(payment.id) ? (
                          <ChevronUpIcon className="h-5 w-5" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5" />
                        ))}
                      #{payment.orderId}
                    </p>
                  </th>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <p className="truncate overflow-hidden text-ellipsis whitespace-nowrap max-w-80">
                      {payment.orderName}
                    </p>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-primary-100 text-primary-800 text-xs px-1.5 py-0.5 rounded dark:bg-primary-900 dark:text-primary-300">
                      {dayjs(payment.createdAt).format('YYYY.MM.DD')}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">{payment.owner.email}</td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                      {payment.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap">
                    {payment.totalAmount.toLocaleString()}원
                  </td>

                  <td className="px-4 py-3 whitespace-nowrap text-primary-600">
                    {(payment?.itemLength || 0).toLocaleString()}
                  </td>
                </tr>

                {expandedRows.includes(payment.id) && !!payment.orders?.length && (
                  <tr className="border-b dark:border-gray-700">
                    <th
                      scope="row"
                      colSpan={7}
                      className="pl-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <div className="flex items-center space-x-2 flex-wrap">
                        {payment.orders.map((o, idx) => (
                          <div key={idx} className="w-auto grid grid-cols-3 gap-3 my-2">
                            <Image
                              src={o.productInfo.thumbnailUrl}
                              alt="Image"
                              className="rounded-xl object-cover w-30 h-30"
                              width={500}
                              height={500}
                            />
                            <div>
                              <div className="font-semibold">{o.productInfo.pname}</div>
                              <div className="font-light">
                                가격: {o.productInfo.price.toLocaleString()}
                              </div>
                              <div className="font-light">색상: {o.productInfo.color.text}</div>
                              <div className="font-light">사이즈: {o.productInfo.size}</div>
                            </div>
                            <div className="font-light text-gray-500">
                              X {o.productInfo.qty.toLocaleString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </th>
                  </tr>
                )}
              </Fragment>
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
