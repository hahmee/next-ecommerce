'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { DateValueType } from 'react-tailwindcss-datepicker/dist/types';

import type { PageResponse } from '@/entities/order';
import type { Paging } from '@/entities/order';
import { orderApi } from '@/entities/order';
import type { Payment } from '@/entities/payment/model/types';
import { DatepickType } from '@/shared/model/DatepickType';

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

export function useOrdersTable() {
  const [date, setDate] = useState<DatepickType>({ startDate: '', endDate: '' });
  const [paging, setPaging] = useState<Paging>(initialPagingData);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const keyDate = useMemo(
    () => ({ startDate: date.startDate, endDate: date.endDate }),
    [date.startDate, date.endDate],
  );

  const { data, isFetching } = useQuery<PageResponse<Payment>>({
    queryKey: ['adminOrders', { page, size, search, ...keyDate }],
    queryFn: () => orderApi.searchAdmin(page, size, search, keyDate.startDate, keyDate.endDate),
    staleTime: 60_000,
    gcTime: 300_000,
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
  const changeSize = (n: number) => {
    setSize(n);
    setPage(1);
  };
  const changePage = (n: number) => setPage(n);
  const toggleRow = (id: number) =>
    setExpandedRows((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const dateChange = useCallback((value: DateValueType) => {
    setPage(1);
    if (!value || !value.startDate || !value.endDate) {
      setDate({ startDate: '', endDate: '' });
      return;
    }
    setDate({
      startDate: dayjs(value.startDate).format('YYYY-MM-DD'),
      endDate: dayjs(value.endDate).format('YYYY-MM-DD'),
    });
  }, []);

  return {
    list: data?.dtoList ?? [],
    paging,
    isFetching,
    page,
    size,
    search,
    date,
    expandedRows,
    handleSearch,
    changeSize,
    changePage,
    toggleRow,
    dateChange,
  };
}
