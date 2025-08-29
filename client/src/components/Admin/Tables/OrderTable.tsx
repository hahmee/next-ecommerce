'use client';

import { useQuery } from '@tanstack/react-query';
import { PageResponse } from '@/interface/PageResponse';
import PageComponent from '@/components/Admin/Tables/PageComponent';
import { Paging } from '@/interface/Paging';
import ViewButton from '@/components/Admin/Tables/ViewButton';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import TableSearch from '@/components/Admin/Tables/TableSearch';
import { Payment } from '@/interface/Payment';
import { initalPagingData } from '@/components/Admin/Tables/ProductTable';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { getOrdersByEmail } from '@/apis/adminAPI';
import dayjs from 'dayjs';
import { DateValueType } from 'react-tailwindcss-datepicker/dist/types';
import { DatepickType } from '@/types/DatepickType';
import dynamic from 'next/dynamic';

const TableDatePicker = dynamic(() => import('./TableDatePicker'), { ssr: false });

const OrderTable = () => {
  const [date, setDate] = useState<DatepickType>({
    startDate: '', // 기본값: 빈 값으로 -> 전체 기간 검색
    endDate: '',
  });
  const [paging, setPaging] = useState<Paging>(initalPagingData);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [search, setSearch] = useState<string>('');
  const [payments, setPayments] = useState<PageResponse<Payment>>();
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const { isFetched, isFetching, data, error, isError } = useQuery<
    PageResponse<Payment>,
    Object,
    PageResponse<Payment>,
    [_1: string, _2: Object]
  >({
    queryKey: ['adminOrders', { page, size, search, date }],
    queryFn: () =>
      getOrdersByEmail({
        page,
        size,
        search,
        startDate: date.startDate ?? '',
        endDate: date.endDate ?? '',
      }),
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    throwOnError: true,
  });

  useEffect(() => {
    setPayments(data);
    if (data) {
      const { dtoList, ...otherData } = data;
      setPaging(otherData);
    }
  }, [data]);

  const handleSearch = (value: string) => {
    setSearch(value); // 검색어 업데이트
    value && setPage(1);
  };

  const changeSize = (size: number) => {
    setSize(size);
    setPage(1);
  };

  const changePage = (page: number) => {
    setPage(page);
  };

  // 행 클릭 시 확장 여부 토글
  const toggleRow = (id: number) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id)
        ? prevExpandedRows.filter((rowId) => rowId !== id)
        : [...prevExpandedRows, id],
    );
  };

  const dateChange = useCallback((value: DateValueType) => {
    setPage(1);

    if (value === null || value?.startDate === null || value?.endDate === null) {
      return;
    }

    const start = dayjs(value.startDate);
    const end = dayjs(value.endDate);

    setDate({
      startDate: start.format('YYYY-MM-DD'),
      endDate: end.format('YYYY-MM-DD'),
    });
  }, []);

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-sm">
      <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
        <div className="w-full md:w-1/3">
          <TableSearch onSearch={handleSearch} placeholder="Search order name or order number" />{' '}
          {/* 검색어 전달 */}
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
              <th scope="col" className="px-4 py-3">
                Order
              </th>
              <th scope="col" className="px-4 py-3">
                Order Name
              </th>
              <th scope="col" className="px-4 py-3">
                Date created
              </th>
              <th scope="col" className="px-4 py-3">
                Customer
              </th>
              <th scope="col" className="px-4 py-3">
                Fulfillment
              </th>
              <th scope="col" className="px-4 py-3">
                Total
              </th>
              <th scope="col" className="px-4 py-3">
                Item
              </th>
            </tr>
          </thead>
          <tbody>
            {payments?.dtoList?.map((payment, key) => {
              return (
                <Fragment key={payment.id}>
                  <tr
                    className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                    key={key}
                    onClick={() => toggleRow(payment.id)}
                  >
                    <th
                      scope="row"
                      className="pl-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <p className="truncate flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap max-w-80">
                        {payment.orders &&
                          payment.orders.length > 0 &&
                          (expandedRows.includes(payment.id) ? (
                            <ChevronUpIcon className="h-5 w-5 " />
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
                    <td className="px-4 py-3 whitespace-nowrap text-primary-600 flex items-center">
                      {(payment?.itemLength || 0).toLocaleString()}
                    </td>
                  </tr>
                  {expandedRows.includes(payment.id) &&
                    payment.orders &&
                    payment.orders.length > 0 && (
                      <tr className="border-b dark:border-gray-700">
                        <th
                          scope="row"
                          colSpan={7}
                          className="pl-4 py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          <div className="flex items-center space-x-2 flex-wrap">
                            {payment.orders.map((payment, key) => (
                              <div key={key} className="w-auto grid grid-cols-3 gap-3 my-2">
                                <Image
                                  src={payment.productInfo.thumbnailUrl}
                                  alt="Image"
                                  className="rounded-xl object-cover w-30 h-30" // 크기 조정
                                  width={500}
                                  height={500}
                                />
                                <div>
                                  <div className="font-semibold">{payment.productInfo.pname}</div>
                                  <div className="font-light">
                                    가격: {payment.productInfo.price.toLocaleString()}
                                  </div>
                                  <div className="font-light">
                                    색상: {payment.productInfo.color.text}
                                  </div>
                                  <div className="font-light">
                                    사이즈: {payment.productInfo.size}
                                  </div>
                                </div>
                                <div className="font-light text-gray-500">
                                  X {payment.productInfo.qty.toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>
                        </th>
                      </tr>
                    )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-6 md:px-6 xl:px-7.5">
        <PageComponent pagingData={paging} size={size} search={search} changePage={changePage} />
      </div>
    </div>
  );
};

export default OrderTable;
