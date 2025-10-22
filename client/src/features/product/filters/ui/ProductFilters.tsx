// src/features/product/filters/ui/ProductFilters.tsx



import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import React, { Fragment, useMemo, useState } from 'react';

import { Category } from '@/entities/category/model/types';
import { FilterOption, FilterSection } from '@/entities/product/ui/ProductListView';
import PriceRange from '@/features/product/filters/ui/PriceRange';
import { useSafeSearchParams } from '@/shared/lib/useSafeSearchParams';

type Props = { filters: FilterSection[] };

const maxPrice = 1_000_000;
const minPrice = 0;

const ProductFilters: React.FC<Props> = ({ filters }) => {
  const router = useRouter();
  const searchParams = useSafeSearchParams();

  // searchParams 객체 레퍼런스가 매번 바뀌어도, 문자열 키는 같으면 그대로 유지됨
  const searchKey = useMemo(() => searchParams.toString(), [searchParams]);

  // 상태 대신 메모: filters + searchKey -> filterStates
  const filterStates = useMemo<Record<string, FilterOption[]>>(() => {
    const params = new URLSearchParams(searchKey);
    const next: Record<string, FilterOption[]> = {};

    for (const section of filters) {
      const current = params.getAll(section.id);
      next[section.id] = section.options.map((option) => ({
        ...option,
        checked: current.includes(option.value),
      }));
    }

    return next;
  }, [filters, searchKey]);

  const [values, setValues] = useState([minPrice, maxPrice]);
  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  const toggleFilter = (sectionId: string, value?: string) => {
    if (!value) return;
    const params = new URLSearchParams(searchKey);

    const current = params.getAll(sectionId);
    if (current.includes(value)) {
      params.delete(sectionId);
      current.filter((x) => x !== value).forEach((x) => params.append(sectionId, x));
    } else {
      params.append(sectionId, value);
    }
    router.push(`/list?${params.toString()}`);
  };

  const toggleRow = (id: number) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const renderCategoryRows = (categories: Category[], depth = 0) =>
    categories.map((category) => (
      <Fragment key={category.cno}>
        <li
          className="flex items-center cursor-pointer justify-between"
          style={{ paddingLeft: `${depth * 20}px` }}
          onClick={() => router.push(`/list?category_id=${category.cno}`)}
        >
          <div>{category.cname}</div>
          {category.subCategories && (
            <div
              onClick={(e) => {
                e.stopPropagation();
                toggleRow(category.cno);
              }}
            >
              {expandedRows.includes(category.cno) ? (
                <ChevronUpIcon className="h-5 w-5" />
              ) : (
                <ChevronDownIcon className="h-5 w-5" />
              )}
            </div>
          )}
        </li>
        {expandedRows.includes(category.cno) &&
          category.subCategories &&
          renderCategoryRows(category.subCategories, depth + 1)}
      </Fragment>
    ));

  const onChangePrice = (vals: number[]) => setValues(vals);

  const onClickPrice = () => {
    const params = new URLSearchParams(searchKey);
    params.delete('maxPrice');
    params.delete('minPrice');
    params.append('minPrice', String(values[0]));
    params.append('maxPrice', String(values[1]));
    router.push(`/list?${params.toString()}`);
  };

  return (
    <>
      {filters.slice(0, 1).map((section) => (
        <div key={section.id} className="border-b border-gray-200 py-6">
          <h3 className="flex justify-between">
            <span className="font-medium text-gray-900">{section.name}</span>
          </h3>
          <div className="space-y-4 pt-6">
            {section.options.map((option, index) => (
              <div key={index} className="flex items-center">
                <input
                  checked={
                    filterStates[section.id]?.find((o) => o.value === option.value)?.checked ??
                    false
                  }
                  id={`filter-${section.id}-${option.value}`}
                  name={`${section.id}[]`}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  onChange={() => toggleFilter(section.id, option.value)}
                />
                <label
                  htmlFor={`filter-${section.id}-${option.value}`}
                  className="ml-3 text-gray-500"
                >
                  {option.label}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Color Filter */}
      <div className="border-b border-gray-200 py-6">
        <h3 className="flex justify-between">
          <span className="font-medium text-gray-900">{filters[2].name}</span>
        </h3>
        <div className="pt-6 grid grid-cols-4 gap-4">
          {filters[2].options.map((color: any) => (
            <div
              key={color.value}
              className="flex flex-col gap-1 items-center justify-between"
              onClick={() => toggleFilter('color', color.value)}
            >
              <div
                className={`w-6 h-6 rounded-lg ring-black2-400 cursor-pointer ${
                  filterStates.color?.find((o) => o.value === color.value)?.checked
                    ? 'ring-4'
                    : 'ring-1'
                }`}
                style={{ backgroundColor: `${color.hexCode}` }}
              />
              <div className="text-sm cursor-pointer">{color.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="border-b border-gray-200 py-6">
        <h3 className="flex justify-between">
          <span className="font-medium text-gray-900">Price range</span>
        </h3>
        <div className="space-y-4 pt-6">
          <PriceRange min={minPrice} max={maxPrice} onChange={onChangePrice} />
          <button
            type="button"
            className="w-full text-sm rounded-3xl ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
            onClick={onClickPrice}
          >
            검색
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductFilters;
