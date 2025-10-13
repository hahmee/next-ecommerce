'use client';

import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { categoryApi } from '@/entities/category/model/service';
import type { Category } from '@/entities/category/model/types';
import type { PageResponse } from '@/entities/order/model/PageResponse';
import { productApi } from '@/entities/product/model/service';
import type { Product } from '@/entities/product/model/types';

type Params = {
  categoryId?: string;
  colors: string[];
  sizes: string[];
  minPrice: string;
  maxPrice: string;
  order: string;
  query: string;
  row?: number;
};

export function useProductList({
  categoryId = '',
  colors,
  sizes,
  minPrice,
  maxPrice,
  order,
  query,
  row = 2,
}: Params) {
  const { data, hasNextPage, isFetching, isLoading, fetchNextPage, isError, isFetchingNextPage } =
    useInfiniteQuery<PageResponse<Product>>({
      queryKey: ['products', categoryId, colors, sizes, minPrice, maxPrice, order, query],
      queryFn: ({ pageParam }) =>
        productApi.listPublic({
          page: pageParam as number,
          row,
          categoryId,
          colors,
          productSizes: sizes,
          minPrice,
          maxPrice,
          order,
          query,
        }),
      getNextPageParam: (lastPage) => {
        if (!lastPage?.dtoList?.length) return undefined;
        return (lastPage.current ?? 1) + 1;
      },
      initialPageParam: 1,
      staleTime: 60_000,
      retry: 0,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    });

  const allProducts = data?.pages?.flatMap((p) => p.dtoList) ?? [];

  const categoriesQuery = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => categoryApi.listPublic(),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
  });

  const categoryQuery = useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: () => categoryApi.byIdPublic(categoryId!),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
    enabled: !!categoryId,
  });

  // infinite scroll
  const { ref: loadMoreRef, inView } = useInView({ rootMargin: '200px', threshold: 0 });
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    pages: data?.pages ?? [],
    allProducts,
    hasNextPage,
    isFetching,
    isLoading,
    isError,
    isFetchingNextPage,
    fetchNextPage,
    loadMoreRef,
    categories: categoriesQuery.data ?? [],
    category: categoryQuery.data,
  } as const;
}
