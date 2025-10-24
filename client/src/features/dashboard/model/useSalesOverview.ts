'use client';

import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useCallback, useMemo, useState } from 'react';
import type { DateValueType } from 'react-tailwindcss-datepicker/dist/types';

import type { CardResponse } from '@/entities/analytics';
import type { ChartResponse } from '@/entities/analytics';
import { dashboardApi } from '@/entities/analytics';
import { ChartContext } from '@/entities/analytics';
import { ChartFilter } from '@/entities/analytics';
import type { DatepickType } from '@/shared/model/DatepickType';

function makeComparedRange(startStr: string, endStr: string) {
  const start = dayjs(startStr);
  const end = dayjs(endStr);
  const diff = end.diff(start, 'day');
  const comparedEnd = start.subtract(1, 'day');
  const comparedStart = comparedEnd.subtract(diff, 'day');
  return {
    startDate: comparedStart.format('YYYY-MM-DD'),
    endDate: comparedEnd.format('YYYY-MM-DD'),
  };
}

export function useSalesOverview({ initialToday }: { initialToday: string }) {
  const today = dayjs(initialToday);
  const start = today.subtract(4, 'month');
  const comparedEnd = start.subtract(1, 'day');
  const comparedStart = comparedEnd.subtract(4, 'month');

  const [selectedCard, setSelectedCard] = useState<ChartContext>(ChartContext.TOPSALES);
  const [currentFilter, setCurrentFilter] = useState<ChartFilter>(ChartFilter.DAY);

  const [date, setDate] = useState<DatepickType>({
    startDate: start.format('YYYY-MM-DD'),
    endDate: today.format('YYYY-MM-DD'),
  });

  const [comparedDate, setComparedDate] = useState<DatepickType>({
    startDate: comparedStart.format('YYYY-MM-DD'),
    endDate: comparedEnd.format('YYYY-MM-DD'),
  });

  const maxDate = useMemo(() => today.toDate(), [today]);

  const { data: salesCards } = useQuery<CardResponse>({
    queryKey: ['salesCards', currentFilter, date, selectedCard],
    queryFn: () =>
      dashboardApi.salesCards({
        startDate: date.startDate!,
        endDate: date.endDate!,
        filter: currentFilter,
        comparedStartDate: comparedDate.startDate!,
        comparedEndDate: comparedDate.endDate!,
        context: selectedCard,
      }),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
    enabled:
      !!date.startDate && !!date.endDate && !!comparedDate.startDate && !!comparedDate.endDate,
  });

  const { data: salesCharts } = useQuery<ChartResponse>({
    queryKey: ['salesCharts', currentFilter, date, selectedCard],
    queryFn: () =>
      dashboardApi.salesCharts({
        startDate: date.startDate!,
        endDate: date.endDate!,
        filter: currentFilter,
        comparedStartDate: comparedDate.startDate!,
        comparedEndDate: comparedDate.endDate!,
        context: selectedCard,
      }),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
    enabled:
      !!date.startDate && !!date.endDate && !!comparedDate.startDate && !!comparedDate.endDate,
  });

  const dateChange = useCallback((value: DateValueType) => {
    if (!value?.startDate || !value?.endDate) return;
    const startStr = dayjs(value.startDate).format('YYYY-MM-DD');
    const endStr = dayjs(value.endDate).format('YYYY-MM-DD');
    setDate({ startDate: startStr, endDate: endStr });
    setComparedDate(makeComparedRange(startStr, endStr));
  }, []);

  const filterChange = useCallback((filter: ChartFilter) => {
    setCurrentFilter(filter);
  }, []);

  const clickCard = useCallback((id: ChartContext) => {
    setSelectedCard(id);
  }, []);

  return {
    // state / 값
    date,
    comparedDate,
    currentFilter,
    selectedCard,
    salesCards,
    salesCharts,
    maxDate,
    // 핸들러
    dateChange,
    filterChange,
    clickCard,
  };
}
