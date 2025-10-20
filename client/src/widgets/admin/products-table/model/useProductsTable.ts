// src/widgets/admin/products-table/model/useProductsTable.ts

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

import type { PageResponse } from '@/entities/order/model/PageResponse';
import type { Paging } from '@/entities/order/model/Paging';
import { productApi } from '@/entities/product/api/productApi';
import type { Product } from '@/entities/product/model/types';

export const initialPaging: Paging = {
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0,
  prev: false,
  next: false,
  pageNumList: [0],
};

export function useProductsTable() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const qc = useQueryClient();

  const { data } = useQuery({
    queryKey: ['adminProducts', { page, size, search }],
    queryFn: () => productApi.searchAdmin(page, size, search),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  const rows: Product[] = data?.dtoList ?? [];

  // 서버 페이징 메타는 dtoList 외 나머지로 가정
  const paging: Paging = useMemo(() => {
    if (!data) return initialPaging;
    const { dtoList, ...rest } = data;
    return rest as Paging;
  }, [data]);

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    if (value) setPage(1);
  }, []);

  const changeSize = useCallback((v: number) => {
    setSize(v);
    setPage(1);
  }, []);

  const changePage = useCallback((v: number) => setPage(v), []);

  const clickModal = useCallback(() => {
    setShowDialog((v) => !v);
  }, []);

  const deleteMutation = useMutation({
    mutationFn: (pno: number) => productApi.remove(pno),
    // 낙관적 업데이트
    onMutate: async (pno) => {
      const key = ['adminProducts', { page, size, search }];
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<PageResponse<Product>>(key);
      if (prev) {
        const nextDto = prev.dtoList.filter((p) => p.pno !== pno);
        const nextTotal =
          typeof (prev as any).totalCount === 'number'
            ? Math.max(0, (prev as any).totalCount - 1)
            : (prev as any).totalCount;
        qc.setQueryData(key, { ...prev, dtoList: nextDto, totalCount: nextTotal });
      }
      return { prev, key };
    },
    // 에러 시: 이전 상태로 롤백만 (토스트/세션만료는 전역에서 처리)
    onError: (_err, _pno, ctx) => {
      if (ctx?.prev && ctx?.key) qc.setQueryData(ctx.key, ctx.prev);
    },
    onSuccess: () => {
      toast.success('삭제되었습니다.');
      setShowDialog(false);
      setDeleteId(null);
    },
    onSettled: () => {
      // 서버 소스와 동기화
      qc.invalidateQueries({ queryKey: ['adminProducts'] });
    },
  });

  const requestDelete = useCallback((pno: number) => {
    setDeleteId(pno);
    setShowDialog(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (deleteId != null) deleteMutation.mutate(deleteId);
  }, [deleteId, deleteMutation]);

  return {
    // 데이터
    rows,
    paging,
    page,
    size,
    search,
    // 로딩/상태
    showDialog,
    deleteId,
    // 액션
    handleSearch,
    changeSize,
    changePage,
    clickModal,
    requestDelete,
    confirmDelete,
  };
}
