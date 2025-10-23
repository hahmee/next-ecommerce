import type { FetchInfiniteQueryOptions } from '@tanstack/react-query';
import React, { Suspense } from 'react';

import { categoryApi } from '@/entities/category';
import { productApi } from '@/entities/product';
import {ProductList} from '@/entities/product';
import { PrefetchBoundary } from '@/shared/ui/PrefetchBoundary';
import ListPageSkeleton from '@/shared/ui/skeletons/ListPageSkeleton';

interface Props {
  categoryId: string;
  colors: string[];
  sizes: string[];
  minPrice: string;
  maxPrice: string;
  order: string;
  query: string;
}

export async function ListPage({
  categoryId,
  colors,
  sizes,
  minPrice,
  maxPrice,
  order,
  query,
}: Props) {
  const prefetchInfiniteOptions: FetchInfiniteQueryOptions[] = [
    {
      queryKey: ['products', categoryId, colors, sizes, minPrice, maxPrice, order, query],
      queryFn: ({ pageParam }) =>
        productApi.listPublic({
          page: (pageParam as number) ?? 1,
          row: 1, // 첫 페이지만 프리패치
          categoryId,
          colors,
          productSizes: sizes,
          minPrice,
          maxPrice,
          order,
          query,
        }),
      initialPageParam: 1,
      staleTime: Infinity,
    },
  ];

  const prefetchOptions = [
    { queryKey: ['categories'], queryFn: () => categoryApi.listPublic() },
    {
      queryKey: ['category', categoryId],
      queryFn: () => categoryApi.byIdPublic(categoryId),
      enabled: !!categoryId,
    },
  ];

  return (
    <Suspense fallback={<ListPageSkeleton />}>
      <PrefetchBoundary
        prefetchInfiniteOptions={prefetchInfiniteOptions}
        prefetchOptions={prefetchOptions}
      >
        <ProductList
          categoryId={categoryId}
          colors={colors}
          sizes={sizes}
          minPrice={minPrice}
          maxPrice={maxPrice}
          order={order}
          query={query}
        />
      </PrefetchBoundary>
    </Suspense>
  );
}
