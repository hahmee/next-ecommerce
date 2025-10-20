// src/widgets/layout/ui/FullMenuView.tsx

'use client';

import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

import type { Category } from '@/entities/category/model/types';
import { useSafeSearchParams } from '@/shared/lib/useSafeSearchParams';

interface Props {
  categories: Category[];
}

export function FullMenuView({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSafeSearchParams();
  const categoryId = searchParams.get('category_id');

  const [hoverCategoryId, setHoverCategoryId] = useState<number | null>(null);

  const onClickCategory = (cno: number) => {
    router.push(`/list?category_id=${cno}`);
  };

  const renderSub = (subs: Category[]) =>
    subs?.map((sub) => (
      <div key={sub.cno} className="m-2">
        <div
          className="flex items-center cursor-pointer justify-between p-2 hover:bg-gray-100 hover:rounded-2xl"
          onClick={() => onClickCategory(sub.cno)}
        >
          <div className="text-sm font-medium text-gray-900">{sub.cname}</div>
        </div>
        {sub.subCategories && renderSub(sub.subCategories)}
      </div>
    ));

  return (
    <div className="hidden md:flex gap-4 relative">
      <div onClick={(e) => e.stopPropagation()}>
        <div
          role="list"
          className="flex items-center justify-center w-full text-sm font-medium text-gray-900"
        >
          {categories.map((category) => (
            <div key={category.cno} className="relative">
              <div
                className="flex items-center cursor-pointer px-3 gap-0.5 hover:bg-gray-100 hover:rounded-2xl mx-1.5 py-2.5"
                onClick={() => onClickCategory(category.cno)}
                onMouseEnter={() => setHoverCategoryId(category.cno)}
                onMouseLeave={() => setHoverCategoryId(null)}
              >
                <div
                  className={
                    category.cno.toString() === categoryId
                      ? 'text-ecom font-bold text-base'
                      : 'font-medium text-gray-900 text-base'
                  }
                >
                  {category.cname}
                </div>
                {category.subCategories && <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
              </div>

              {hoverCategoryId === category.cno && category.subCategories && (
                <div
                  className="absolute w-56 rounded-lg bg-white shadow-lg top-10 z-20 transition-all duration-300 opacity-100 scale-100"
                  onMouseEnter={() => setHoverCategoryId(category.cno)}
                  onMouseLeave={() => setHoverCategoryId(null)}
                >
                  {renderSub(category.subCategories)}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
