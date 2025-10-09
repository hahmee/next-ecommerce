'use client';

import {useEffect} from 'react';
import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import type {Product} from '@/interface/Product';
import type {PageResponse} from '@/interface/PageResponse';
import type {Category} from '@/interface/Category';
import {useInView} from 'react-intersection-observer';
import {productApi} from "@/libs/services/productApi";
import {categoryApi} from "@/libs/services/categoryApi";

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
  const {
    data,
    hasNextPage,
    isFetching,
    isLoading,
    fetchNextPage,
    isError,
    isFetchingNextPage,
  } = useInfiniteQuery<PageResponse<Product>>({
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
    throwOnError: true,
  });

  const categoryQuery = useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: () => categoryApi.byIdPublic(categoryId!),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
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
