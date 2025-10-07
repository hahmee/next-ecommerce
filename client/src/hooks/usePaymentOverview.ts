'use client';

import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import type { Option } from '@/interface/Option';
import type { PaymentSummaryDTO } from '@/interface/PaymentSummaryDTO';
import { paymentsApi } from '@/libs/services/paymentsApi';

const mkRange = (days: number) => {
  const end = dayjs();
  const start = end.subtract(days - 1, 'day');
  return { startDate: start.format('YYYY-MM-DD'), endDate: end.format('YYYY-MM-DD') };
};

export function usePaymentOverview() {
  const menu: Array<Option<string> & { startDate: string; endDate: string }> = [
    { id: 'last30days', content: '지난 30일', ...mkRange(30) },
    { id: 'last7days', content: '지난 7일', ...mkRange(7) },
    { id: 'last90days', content: '지난 90일', ...mkRange(90) },
    { id: 'today', content: '오늘', ...mkRange(1) },
    { id: 'all', content: '전체 기간', startDate: '', endDate: '' },
  ];

  const [show, setShow] = useState(false);
  const [selected, setSelected] = useState(menu[0]);
  const date = useMemo(() => ({ startDate: selected.startDate, endDate: selected.endDate }), [selected]);

  const { data, isFetching } = useQuery<PaymentSummaryDTO>({
    queryKey: ['adminPaymentOverview', { date }],
    queryFn: () => paymentsApi.overview(date.startDate, date.endDate),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
    retry: 1,
  });

  const onPick = (opt: typeof menu[number]) => {
    setSelected(opt);
    setShow(false);
  };

  return {
    totalAmount: data?.totalAmount ?? 0,
    count: data?.count ?? 0,
    isFetching,
    menu,
    selected,
    show,
    setShow,
    onPick,
  };
}
