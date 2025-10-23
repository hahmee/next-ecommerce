'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { categoryApi } from '@/entities/category';
import type { Category } from '@/entities/category';
import { Mode } from '@/shared/constants/mode';

export interface CategoryFormValues {
  cname: string;
  cdesc: string;
  file: FileList;
}

export function useCategoryForm({ type, id }: { type: Mode; id?: string }) {
  const qc = useQueryClient();
  const router = useRouter();
  const [preview, setPreview] = useState<string>('');

  const { data: original } = useQuery<Category>({
    queryKey: ['category', id],
    queryFn: () => categoryApi.byId(id as string),
    enabled: type === Mode.EDIT && !!id,
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  const { data: categoryPaths = [] } = useQuery<Category[]>({
    queryKey: ['categoryPaths', id],
    queryFn: () => categoryApi.paths(id as string),
    enabled: !!id,
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  const form = useForm<CategoryFormValues>();
  const file = form.watch('file')?.[0];

  useEffect(() => {
    if (original && type === Mode.EDIT) {
      form.reset({ cname: original.cname, cdesc: original.cdesc });
      setPreview(original.uploadFileName || '');
    }
  }, [original, type]);

  useEffect(() => {
    if (file) setPreview(URL.createObjectURL(file));
  }, [file]);

  const buildFormData = (values: CategoryFormValues) => {
    const fd = new FormData();
    fd.append('cname', values.cname);
    fd.append('cdesc', values.cdesc);
    if (type === Mode.ADD) {
      if (!values.file?.[0]) throw new Error('이미지는 한 개 이상 첨부해주세요.');
      const image = values.file[0];
      if (image.size > 10 * 1024 * 1024) throw new Error('파일의 크기가 10MB를 초과합니다.');
      fd.append('file', image);
      // ADD인 경우 상위 id가 경로상의 parent라면 필요 시 추가 가능:
      if (id) fd.append('parentCategoryId', id);
    } else {
      if (values.file?.[0]) {
        fd.append('file', values.file[0]);
      } else if (original) {
        fd.append('uploadFileName', original.uploadFileName || '');
        fd.append('uploadFileKey', original.uploadFileKey || '');
      }
    }
    return fd;
  };

  const mutation = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      const fd = buildFormData(values);
      return type === Mode.ADD ? categoryApi.create(fd) : categoryApi.update(id as string, fd);
    },
    onSuccess: async (newCategory) => {
      toast.success('업로드 성공했습니다.');

      // 목록 무효화 (서버/클라 키 통일 가정)
      await qc.invalidateQueries({ queryKey: ['adminCategories'] });

      // 단건 캐시 갱신
      qc.setQueryData(['category', String(newCategory.cno)], newCategory);

      // 경로 캐시 갱신 (있을 때만)
      qc.setQueryData(['categoryPaths', String(newCategory.cno)], (prev: Category[] = []) =>
        prev.map((c) => (c.cno === newCategory.cno ? newCategory : c)),
      );

      router.push('/admin/category');
    },
  });

  const onSubmit = form.handleSubmit(
    (v) => mutation.mutate(v),
    (errors) => {
      const first = Object.values(errors)[0];
      if (first?.message) toast.error(String(first.message));
    },
  );

  return {
    form,
    onSubmit,
    submitting: mutation.isPending,
    type,
    preview,
    categoryPaths,
  };
}
