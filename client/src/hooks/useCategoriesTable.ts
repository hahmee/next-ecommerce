'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { categoryApi } from '@/libs/services/categoryApi';
import type { PageResponse } from '@/interface/PageResponse';
import type { CategoryTree } from '@/interface/CategoryTree';
import type { Paging } from '@/interface/Paging';
import { initalPagingData } from '@/components/Admin/Tables/StockTable';

export function useCategoriesTable() {
  const qc = useQueryClient();

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [search, setSearch] = useState('');
  const [expandedRows, setExpandedRows] = useState<number[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState<Record<number, boolean>>({});
  const [showDialog, setShowDialog] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const { data, isFetching } = useQuery<PageResponse<CategoryTree>>({
    queryKey: ['adminCategories', { page, size, search }],
    queryFn: () => categoryApi.searchAdmin(page, size, search),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  const paging: Paging = useMemo(() => {
    if (!data) return initalPagingData;
    const { dtoList, ...rest } = data;
    return rest as Paging;
  }, [data]);

  const dtoList = data?.dtoList ?? [];

  const removeMut = useMutation({
    mutationFn: (cno: number) => categoryApi.remove(cno),
    onSuccess: (deleted) => {
      const ids = Array.isArray(deleted) ? deleted : (deleteId != null ? [deleteId] : []);
      qc.setQueryData<PageResponse<CategoryTree>>(
        ['adminCategories', { page, size, search }],
        (prev) => (prev ? { ...prev, dtoList: prev.dtoList.filter(c => !ids.includes(c.cno)) } : prev),
      );
      toast.success('삭제되었습니다.');
      setShowDialog(false);
      setDeleteId(null);
    },
    onError: (e: any) => toast.error(`오류 발생: ${e?.message ?? e}`),
  });

  const handleSearch = (v: string) => { setSearch(v); if (v) setPage(1); };
  const changeSize = (s: number) => { setSize(s); setPage(1); };
  const changePage = (p: number) => setPage(p);
  const clickModal = () => setShowDialog(v => !v);
  const toggleRow = (id: number) =>
    setExpandedRows(rows => rows.includes(id) ? rows.filter(x => x !== id) : [...rows, id]);
  const toggleDropdown = (id: number) =>
    setDropdownOpen(state => ({ ...state, [id]: !state[id] }));
  const deleteCategory = () => { if (deleteId != null) removeMut.mutate(deleteId); };

  return {
    isFetching, page, size, search, paging, dtoList,
    expandedRows, dropdownOpen, showDialog, deleteId,
    setDeleteId, handleSearch, changeSize, changePage,
    clickModal, toggleRow, toggleDropdown, deleteCategory,
  };
}
