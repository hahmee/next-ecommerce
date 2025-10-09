'use client';

import { useCallback, useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { PageResponse } from '@/interface/PageResponse';
import type { Product } from '@/interface/Product';
import type { Paging } from '@/interface/Paging';
import { productApi } from '@/libs/services/productApi';
import {SalesStatus} from "@/types/salesStatus";

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

export function useStockTable() {
  const qc = useQueryClient();
  const [paging, setPaging] = useState<Paging>(initialPagingData);
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');

  const queryKey = ['adminStockProducts', { page, size, search }] as const;

  const { data, isFetching } = useQuery<PageResponse<Product>>({
    queryKey,
    queryFn: () => productApi.searchAdmin(page, size, search),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  useEffect(() => {
    if (!data) return;
    const { dtoList, ...rest } = data;
    setPaging(rest as Paging);
  }, [data]);

  const handleSearch = (v: string) => { setSearch(v); if (v) setPage(1); };
  const changeSize = (n: number) => { setSize(n); setPage(1); };
  const changePage = (n: number) => setPage(n);

  const mutation = useMutation({
    mutationFn: ({ pno, salesStatus }: { pno: number; salesStatus: SalesStatus }) =>
      productApi.updateStock(pno, salesStatus),

    // 낙관적 업데이트
    onMutate: async ({ pno, salesStatus }) => {
      await qc.cancelQueries({ queryKey });
      const prev = qc.getQueryData<PageResponse<Product>>(queryKey);

      if (prev) {
        const next: PageResponse<Product> = {
          ...prev,
          dtoList: prev.dtoList.map(p =>
            p.pno === pno ? { ...p, salesStatus } : p
          ),
        };
        qc.setQueryData(queryKey, next);
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData(queryKey, ctx.prev);
    },
    onSuccess: (updated) => {
      // 서버 응답으로 한번 더 정합성 맞추기
      qc.setQueryData<PageResponse<Product>>(queryKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          dtoList: prev.dtoList.map(p => (p.pno === updated.pno ? updated : p)),
        };
      });
      toast.success('수정되었습니다.');
    }
  });

  const changeStock = useCallback(
    (pno: number, salesStatus: SalesStatus ) => mutation.mutate({ pno, salesStatus }),
    [mutation],
  );

  return {
    list: data?.dtoList ?? [],
    paging, isFetching,
    page, size, search,
    handleSearch, changeSize, changePage,
    changeStock,
  };
}
