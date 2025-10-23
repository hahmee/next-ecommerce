// src/features/product/manage/model/useProductForm.ts

// src/features/product/manage/model/useProductForm.ts

'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

import { categoryApi } from '@/entities/category/api/categoryApi';
import type { Category } from '@/entities/category/model/types';
import { productApi } from '@/entities/product/api/productApi';
import type { Product } from '@/entities/product/model/types';
import { Mode } from '@/shared/constants/mode';
import { useProductImageStore } from '@/shared/store/productImageStore';
import { useTagStore } from '@/shared/store/tagStore';

export function useProductForm({ type, id }: { type: Mode; id?: string }) {
  const router = useRouter();
  const qc = useQueryClient();
  const imgStore = useProductImageStore();
  const tagStore = useTagStore();
  const setFiles = useProductImageStore((s) => s.setFiles);

  const quillRef = useRef<any>(null);
  const [pdesc, setPdesc] = useState('');
  const [leafCategory, setLeafCategory] = useState<Category | null>(null);

  const { data: original, isLoading: loading } = useQuery<Product>({
    queryKey: ['productSingle', id!],
    queryFn: () => productApi.byId(id!),
    enabled: !!id && type === Mode.EDIT,
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  const { data: categoryPaths } = useQuery<Category[]>({
    queryKey: ['categoryPaths', original ? String(original.categoryId) : '-1'],
    queryFn: () => categoryApi.paths(String(original!.categoryId)),
    enabled: !!(id && type === Mode.EDIT && original),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  const { data: categories } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryApi.list(),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  useEffect(() => {
    if (!original) return;
    const mapped =
      original.uploadFileNames?.map((name, idx) => ({
        dataUrl: name.file,
        uploadKey: original.uploadFileKeys?.[idx]?.file,
        id: name.ord,
      })) ?? [];

    setFiles(mapped);
    setPdesc(original.pdesc || '');
  }, [original, setFiles]);

  useEffect(() => {
    if (categoryPaths?.length) setLeafCategory(categoryPaths.at(-1)!);
  }, [categoryPaths]);

  const buildFormData = (formEl: HTMLFormElement) => {
    if (!leafCategory) throw new Error('최하단 카테고리를 선택해야합니다.');
    if (imgStore.files.length < 1) throw new Error('이미지는 한 개 이상 첨부해주세요.');
    const max = 10 * 1024 * 1024;
    // 각 파일의 크기를 체크
    for (const f of imgStore.files) {
      if (f?.size && f.size > max) throw new Error('파일의 크기가 10MB를 초과합니다.');
    }

    const form = new FormData(formEl);
    const desc = quillRef.current ? quillRef.current.value : '';
    form.append('pdesc', desc);
    form.append('categoryId', String(leafCategory.cno));
    form.append('categoryJson', JSON.stringify(leafCategory));
    tagStore.tags.forEach((t, i) => {
      form.append(`colorList[${i}].text`, t.text);
      form.append(`colorList[${i}].color`, t.color);
    });

    if (type === Mode.ADD) {
      imgStore.files.forEach((p, idx) => {
        form.append(`files[${idx}].file`, p.file!);
        form.append(`files[${idx}].ord`, String(idx));
      });
      return form;
    }
    let newIdx = 0,
      upIdx = 0;
    imgStore.files.forEach((p, idx) => {
      if (!p.file) {
        form.append(`uploadFileNames[${upIdx}].file`, p.dataUrl);
        form.append(`uploadFileNames[${upIdx}].ord`, String(idx));
        form.append(`uploadFileKeys[${upIdx}].file`, p.uploadKey!);
        form.append(`uploadFileKeys[${upIdx}].ord`, String(idx));
        upIdx++;
      } else {
        form.append(`files[${newIdx}].file`, p.file!);
        form.append(`files[${newIdx}].ord`, String(idx));
        newIdx++;
      }
    });
    return form;
  };

  const setCache = (np: Product) => {
    const listKey = ['adminProducts', { page: 1, size: 10, search: '' }];
    qc.setQueryData(listKey, (prev: any) => {
      if (!prev) return prev;
      const dtoList = [...prev.dtoList];
      if (type === Mode.ADD) dtoList.unshift(np);
      else prev.dtoList = dtoList.map((p: Product) => (p.pno === np.pno ? np : p));
      return { ...prev, dtoList };
    });
    qc.setQueryData(['productSingle', String(np.pno)], np);
  };

  const mutation = useMutation({
    mutationFn: async (formEl: HTMLFormElement) => {
      const form = buildFormData(formEl);
      const res =
        type === Mode.ADD ? await productApi.create(form) : await productApi.update(id!, form);
      setCache(res);
      return res;
    },
    onSuccess: () => {
      toast.success('업로드 성공했습니다.');
      router.push('/admin/products');
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate(e.currentTarget);
  };

  return {
    loading,
    quillRef,
    pdesc,
    setPdesc,
    categories: categories ?? [],
    categoryPaths: categoryPaths ?? [],
    setLeafCategory,
    original,
    submitting: mutation.isPending,
    type,
    onSubmit,
  };
}
