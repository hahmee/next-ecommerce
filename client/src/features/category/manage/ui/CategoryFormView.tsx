'use client';

import Image from 'next/image';
import React from 'react';
import type { UseFormReturn } from 'react-hook-form';

import CategoryBreadcrumb from '@/components/Admin/Category/CategoryBreadcrumb';
import type { CategoryFormValues } from '@/features/category/manage/model/useCategoryForm';
import type { Category } from '@/entities/category/model/types';
import { Mode } from '@/entities/common/model/mode';

export function CategoryFormView(props: {
  type: Mode;
  preview: string;
  categoryPaths: Category[];
  form: UseFormReturn<CategoryFormValues>;
  onSubmit: (e?: React.BaseSyntheticEvent) => void;
  submitting: boolean;
}) {
  const { type, preview, categoryPaths, form, onSubmit, submitting } = props;
  const { register } = form;

  return (
    <form onSubmit={onSubmit} className="p-4 md:p-5">
      <div className="grid gap-4 mb-4 grid-cols-2">
        <div className="col-span-2">
          <CategoryBreadcrumb categoryPaths={categoryPaths} />
        </div>

        <div className="col-span-2">
          <label className="mb-3 block text-sm font-medium">카테고리명</label>
          <input
            {...register('cname', { required: '카테고리명은 필수입니다.' })}
            className="w-full rounded border-[1.5px] px-5 py-3"
            placeholder="카테고리명을 입력해주세요."
          />
        </div>

        <div className="col-span-2">
          <label className="block mb-1">카테고리 설명</label>
          <textarea
            {...register('cdesc', { required: '카테고리 설명은 필수입니다.' })}
            placeholder="카테고리 설명을 입력해주세요."
            className="w-full rounded border-[1.5px] px-5 py-3"
          />
        </div>

        <div className="col-span-2">
          <label htmlFor="fileInput" className="mb-3 block text-sm font-medium">
            사진첨부
          </label>
          <div className="w-full">
            {preview ? (
              <Image
                src={preview}
                alt="미리보기"
                width={500}
                height={300}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div>No file selected</div>
            )}
            <input
              type="file"
              id="fileInput"
              accept="image/*"
              {...register('file')}
              className="mt-2 w-full cursor-pointer rounded-lg border-[1.5px] px-5 py-3 file:mr-5 file:border-0"
            />
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="text-white inline-flex items-center bg-blue-700 disabled:opacity-60
                   hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300
                   font-medium rounded-lg text-sm px-5 py-2.5"
      >
        {type === Mode.ADD ? '카테고리 추가' : '카테고리 수정'}
      </button>
    </form>
  );
}
