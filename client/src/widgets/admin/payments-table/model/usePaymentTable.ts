'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DateValueType } from 'react-tailwindcss-datepicker/dist/types';

import { DatepickType } from '@/shared/model/DatepickType';
import type { PageResponse } from '@/entities/order/model/PageResponse';
import type { Paging } from '@/entities/order/model/Paging';
import { paymentApi } from '@/entities/payment/model/service';
import type { Payment } from '@/entities/payment/model/types';

export const initialPagingData: Paging = {
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
  prev: false,
  next: false,
  pageNumList: [0],
};

export function usePaymentTable() {
  const today = dayjs();
  const start = today.subtract(30, 'day');

  const [date, setDate] = useState<DatepickType>({
    startDate: start.format('YYYY-MM-DD'),
    endDate: today.format('YYYY-MM-DD'),
  });
  const [paging, setPaging] = useState<Paging>(initialPagingData);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');

  const keyDate = useMemo(() => ({ ...date }), [date.startDate, date.endDate]);

  const { data, isFetching } = useQuery<PageResponse<Payment>>({
    queryKey: ['adminPayments', { page, size, search, date: keyDate }],
    queryFn: () => paymentApi.searchAdmin(page, size, search, keyDate.startDate, keyDate.endDate),
    staleTime: 60_000,
    gcTime: 300_000,
    enabled: !!keyDate, // date 준비됐을 때
    throwOnError: false,
  });

  useEffect(() => {
    if (!data) return;
    const { dtoList, ...rest } = data;
    setPaging(rest as Paging);
  }, [data]);

  const handleSearch = (v: string) => {
    setSearch(v);
    if (v) setPage(1);
  };
  const changeSize = (n: number) => setSize(n);
  const changePage = (n: number) => setPage(n);

  const dateChange = useCallback((value: DateValueType) => {
    if (!value || !value.startDate || !value.endDate) return;
    setDate({
      startDate: dayjs(value.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(value.endDate).format('YYYY-MM-DD'),
    });
    setPage(1);
  }, []);

  return {
    list: data?.dtoList ?? [],
    paging,
    isFetching,
    page,
    size,
    search,
    date,
    handleSearch,
    changeSize,
    changePage,
    dateChange,
  };
}
