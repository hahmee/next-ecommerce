'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import type { Category } from '@/entities/category';
import { categoryApi } from '@/entities/category';
import type { Product } from '@/entities/product';
import { productApi } from '@/entities/product';
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

  // 데이터 검사 및 만들기
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

  // 리스트/단건 키: 실제 리스트 쿼리와 100% 동일해야 낙관적 업데이트가 보임
  const listKey = ['adminProducts', { page: 1, size: 10, search: '' }] as const;
  const singleKey = id ? (['productSingle', String(id)] as const) : null;

  const mutation = useMutation({
    mutationFn: async (formEl: HTMLFormElement) => {
      const form = buildFormData(formEl);
      return type === Mode.ADD ? productApi.create(form) : productApi.update(id!, form);
    },

    // 낙관적 업데이트
    onMutate: async (formEl) => {
      // 1) 관련 쿼리들 잠깐 정지(경합 방지)
      await qc.cancelQueries({ queryKey: listKey });
      if (singleKey) await qc.cancelQueries({ queryKey: singleKey });

      // 2) 롤백을 위한 스냅샷
      const prevList = qc.getQueryData<any>(listKey);
      const prevSingle = singleKey ? qc.getQueryData<Product>(singleKey) : undefined;

      // 3) 폼에서 최소 정보 뽑아 임시(optimistic) 객체 만들기
      const fd = new FormData(formEl);
      const optimistic: Product =
        type === Mode.ADD
          ? ({
              pno: -Date.now(), // 임시 ID
              pname: String(fd.get('pname') ?? '새 상품'),
              price: Number(fd.get('price') ?? 0),
              categoryId: Number(leafCategory?.cno ?? 0),
              uploadFileNames: imgStore.files.map((f, i) => ({ file: f.dataUrl!, ord: i })),
            } as unknown as Product)
          : ({
              ...(prevSingle as Product),
              pname: String(fd.get('pname') ?? (prevSingle as Product)?.pname ?? ''),
              price: Number(fd.get('price') ?? (prevSingle as Product)?.price ?? 0),
              categoryId: Number(leafCategory?.cno ?? (prevSingle as Product)?.categoryId ?? 0),
            } as Product);

      // 4) 리스트 캐시 먼저 갱신
      qc.setQueryData(listKey, (old: any) => {
        if (!old) return old;
        const dtoList: Product[] = old.dtoList ? [...old.dtoList] : [];
        if (type === Mode.ADD) dtoList.unshift(optimistic);
        else {
          const idx = dtoList.findIndex((p) => p.pno === (prevSingle as Product)?.pno);
          if (idx >= 0) dtoList[idx] = optimistic;
        }
        return { ...old, dtoList };
      });

      // 5) 단건 캐시도 갱신
      if (singleKey) qc.setQueryData(singleKey, optimistic);

      // 6) 컨텍스트로 롤백 데이터 반환
      return { prevList, prevSingle };
    },

    // 에러 시: 이전 상태로 롤백만 (토스트/세션만료는 전역에서 처리)
    onError: (err: any, _vars, ctx) => {
      if (ctx?.prevList) qc.setQueryData(listKey, ctx.prevList);
      if (singleKey && ctx?.prevSingle) qc.setQueryData(singleKey, ctx.prevSingle);
    },

    // 성공: 서버 응답으로 최종 치환
    onSuccess: (data) => {
      // 리스트에서 임시 아이템(-ID) 또는 동일 ID를 서버 응답으로 교체
      qc.setQueryData(listKey, (old: any) => {
        if (!old) return old;
        const dtoList: Product[] = old.dtoList ? [...old.dtoList] : [];
        const idx = dtoList.findIndex((p) => p.pno === data.pno || p.pno < 0);
        if (idx >= 0) dtoList[idx] = data;
        else dtoList.unshift(data); // 혹시 리스트에 없으면 추가
        return { ...old, dtoList };
      });
      qc.setQueryData(['productSingle', String(data.pno)], data);

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
