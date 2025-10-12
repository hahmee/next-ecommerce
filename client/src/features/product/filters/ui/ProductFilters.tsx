import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';

import PriceRange from '@/components/Home/Product/PriceRange';
import { FilterOption, FilterSection } from '@/components/Home/Product/ProductListView';
import { useSafeSearchParams } from '@/hooks/common/useSafeSearchParams';
import { Category } from '@/interface/Category';

type Props = {
  filters: FilterSection[];
};

const maxPrice = 1000000;
const minPrice = 0;

const ProductFilters: React.FC<Props> = ({ filters }: Props) => {
  const router = useRouter();
  const searchParams = useSafeSearchParams();
  const [filterStates, setFilterStates] = useState<Record<string, FilterOption[]>>({
    category: filters[0].options,
    size: filters[1].options,
    color: filters[2].options,
  });

  const [values, setValues] = useState([minPrice, maxPrice]);

  const [expandedRows, setExpandedRows] = useState<number[]>([]);

  useEffect(() => {
    // 쿼리 문자열에서 필터 값을 가져와서 필터 상태를 업데이트
    const newFilterStates = { ...filterStates };

    filters.forEach((section) => {
      const currentFilters = searchParams.getAll(section.id);
      newFilterStates[section.id] = section.options.map((option) => ({
        ...option,
        checked: currentFilters.includes(option.value),
      }));
    });

    setFilterStates(newFilterStates);
  }, [searchParams, filters]);

  const toggleFilter = (sectionId: string, value?: string) => {
    if (value) {
      const params = new URLSearchParams(searchParams.toString());
      // console.log('params', params);
      // console.log('params...', params);
      // 현재 필터가 적용되어 있는지 확인
      const currentFilters = params.getAll(sectionId);

      if (currentFilters.includes(value)) {
        // 필터가 이미 적용되어 있으면 제거
        params.delete(sectionId);
        currentFilters
          .filter((filter) => filter !== value)
          .forEach((filter) => params.append(sectionId, filter));
      } else {
        // 필터가 적용되어 있지 않으면 추가
        params.append(sectionId, value);
      }

      // 새 쿼리스트링으로 URL 업데이트
      router.push(`/list?${params.toString()}`);
    }
  };

  // 행 클릭 시 확장 여부 토글
  const toggleRow = (id: number) => {
    setExpandedRows((prevExpandedRows) =>
      prevExpandedRows.includes(id)
        ? prevExpandedRows.filter((rowId) => rowId !== id)
        : [...prevExpandedRows, id],
    );
  };

  // 재귀적으로 하위 카테고리를 렌더링하는 함수
  const renderCategoryRows = (categories: Category[], depth: number = 0) => {
    return categories.map((category) => (
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
                e.stopPropagation(); // 부모 onClick 이벤트 방지
                toggleRow(category.cno); // toggleRow 함수 호출
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
  };

  const onChangePrice = (values: number[]) => {
    setValues(values);
  };

  const onClickPrice = () => {
    const params = new URLSearchParams(searchParams.toString());

    // 기존 maxPrice, minPrice 필터 삭제
    params.delete('maxPrice');
    params.delete('minPrice');

    // 새로운 maxPrice, minPrice 추가
    params.append('minPrice', values[0].toString()); // 최소값
    params.append('maxPrice', values[1].toString()); // 최대값

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
                    filterStates[section.id].find((o) => o.value === option.value)?.checked || false
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
                className={`w-6 h-6 rounded-lg ring-black2-400 cursor-pointer ${filterStates.color.find((o) => o.value === color.value)?.checked ? 'ring-4' : 'ring-1'}`}
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
