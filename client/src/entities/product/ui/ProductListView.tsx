'use client';

import React, { Fragment, Suspense } from 'react';

import type { Category } from '@/entities/category';
import type { PageResponse } from '@/entities/order';
import type { Params, Product } from '@/entities/product';
import { ProductCard, ProductCategories, ProductOrders } from '@/entities/product';
import { filterPresets, FiltersBadge, ProductFilters } from '@/features/product/filters';
import { useSafeSearchParams } from '@/shared/lib/useSafeSearchParams';
import ListPageSkeleton from '@/shared/ui/skeletons/ListPageSkeleton';
import ProductCardListSkeleton from '@/shared/ui/skeletons/ProductCartListSkeleton';
import ProductCardSkeleton from '@/shared/ui/skeletons/ProductCartSkeleton';

type Props = {
  pages: PageResponse<Product>[];
  allProducts: Product[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  isLoading: boolean;
  loadMoreRef: (node?: Element | null) => void;
  categories: Category[];
  category?: Category;
};

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
              <ProductFilters filters={filterPresets as any} />
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
