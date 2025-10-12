'use client';

import React, { Fragment, Suspense } from 'react';

import FiltersBadge from '@/components/Home/Product/FiltersBadge';
import ProductCard from '@/components/Home/Product/ProductCard';
import ProductCategories from '@/components/Home/Product/ProductCategories';
import ProductFilters from '@/components/Home/Product/ProductFilters';
import ProductOrders from '@/components/Home/Product/ProductOrders';
import ListPageSkeleton from '@/components/Skeleton/ListPageSkeleton';
import ProductCardListSkeleton from '@/components/Skeleton/ProductCartListSkeleton';
import ProductCardSkeleton from '@/components/Skeleton/ProductCartSkeleton';
import { useSafeSearchParams } from '@/hooks/common/useSafeSearchParams';
import type { Category } from '@/interface/Category';
import type { PageResponse } from '@/interface/PageResponse';
import type { Product } from '@/interface/Product';
import { Size } from '@/types/size';

export interface Params {
  key: string;
  value: string;
}

type Props = {
  pages: PageResponse<Product>[];
  allProducts: Product[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  loadMoreRef: (node?: Element | null) => void;
  // ref: (node?: Element | null | undefined) => void;
  categories: Category[];
  category?: Category;
};

export type SortOption = {
  name: string;
  href: string;
  current: boolean;
};

export type FilterOption = {
  value: string;
  label: string;
  hexCode?: string;
  checked: boolean;
};

export type FilterSection = {
  id: string;
  name: string;
  options: FilterOption[];
};

const filters: FilterSection[] = [
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: Size.XS, label: 'XS', checked: false },
      { value: Size.S, label: 'S', checked: false },
      { value: Size.M, label: 'M', checked: false },
      { value: Size.L, label: 'L', checked: false },
      { value: Size.XL, label: 'XL', checked: false },
      { value: Size.XXL, label: '2XL', checked: false },
      { value: Size.XXXL, label: '3XL', checked: false },
      { value: Size.FREE, label: 'FREE', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: true },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', hexCode: '#FFFFFF', checked: false },
      { value: 'red', label: 'Red', hexCode: '#FF6961', checked: false },
      { value: 'beige', label: 'Beige', hexCode: '#F5F5DC', checked: false },
      { value: 'blue', label: 'Blue', hexCode: '#AEC6CF', checked: false },
      { value: 'brown', label: 'Brown', hexCode: '#cebaa0', checked: false },
      { value: 'green', label: 'Green', hexCode: '#77DD77', checked: false },
      { value: 'purple', label: 'Purple', hexCode: '#C3B1E1', checked: false },
    ],
  },
];
export function ProductListView({
  pages,
  allProducts,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
  loadMoreRef,
  categories,
  category,
}: Props) {
  const searchParams = useSafeSearchParams();
  const searchValue = searchParams.get('query');

  const paramsArray: Params[] = searchParams
    ? Array.from(searchParams.entries()).map(([key, value]) => ({ key, value }))
    : [];

  if (isLoading) return <ListPageSkeleton />;

  return (
    <div className="bg-white">
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-24">
          {searchValue ? (
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">검색결과</h1>
              <p className="text-sm md:text-base text-slate-500 my-3.5">{searchValue}</p>
            </div>
          ) : (
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                {category?.cname || '전체검색'}
              </h1>
              <p className="text-sm md:text-base text-slate-500 my-3.5">
                {category?.cdesc || '전체검색 결과입니다.'}
              </p>
            </div>
          )}
        </div>

        <section aria-labelledby="products-heading" className="pb-24 pt-6">
          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
            {/* Filters */}
            <form className="hidden lg:block">
              <ProductCategories categories={categories} />
              <ProductFilters filters={filters as any} />
            </form>

            {/* Product Grid */}
            <div className="lg:col-span-3">
              {/* Badges + Orders */}
              <div className="w-full flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                  {paramsArray?.map((param: Params, index: number) =>
                    param.key === 'category_id' ? (
                      <FiltersBadge key={index} category={category} param={param} />
                    ) : (
                      <FiltersBadge key={index} param={param} />
                    ),
                  )}
                </div>
                <ProductOrders />
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3">
                {allProducts.length < 1 ? (
                  <div>상품이 없습니다.</div>
                ) : (
                  pages.map((page, idx) => (
                    <Fragment key={idx}>
                      {page.dtoList.map((product: Product) => (
                        <Suspense fallback={<ProductCardSkeleton />} key={product.pno}>
                          <ProductCard product={product} index={idx} />
                        </Suspense>
                      ))}
                    </Fragment>
                  ))
                )}
              </div>

              {isFetchingNextPage ? (
                <div className="mt-6">
                  <ProductCardListSkeleton />
                </div>
              ) : hasNextPage ? (
                <div ref={loadMoreRef} className="h-10 flex justify-center items-center mt-4">
                  스크롤을 내려주세요.
                </div>
              ) : (
                <div className="mt-4 flex justify-center items-center">더 이상 없습니다.</div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
