import type { FetchInfiniteQueryOptions } from '@tanstack/react-query';
import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import ProductList from '@/components/Home/Product/ProductList';
import ListPageSkeleton from '@/components/Skeleton/ListPageSkeleton';
import { PrefetchBoundary } from '@/libs/PrefetchBoundary';
import { categoryApi } from '@/libs/services/categoryApi';
import { productApi } from '@/libs/services/productApi';

interface Props {
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const filters = Object.entries(searchParams).map(([key, value]) => {
    const values = Array.isArray(value) ? value : value ? [value] : [];
    return { key, values };
  });

  const query = filters.find((f) => f.key === 'query')?.values[0] || '';
  const categoryId = filters.find((f) => f.key === 'category_id')?.values[0] || '';

  let categoryName = '';
  try {
    if (categoryId) {
      const categoryRes = await categoryApi.byIdPublic(categoryId);
      categoryName = categoryRes?.cname || '전체';
    }
  } catch (e) {
    console.error('category fetch error:', e);
  }

  const filterSummary = filters
    .filter(({ key, values }) => key !== 'query' && key !== 'category_id' && values.length > 0)
    .map(({ key, values }) => `${key}: ${values.join(', ')}`)
    .join(' | ');

  const titleParts = [
    query && `검색어: ${decodeURIComponent(query)}`,
    categoryName && `카테고리: ${categoryName}`,
    filterSummary,
  ].filter(Boolean);

  const fullTitle =
    titleParts.length > 0
      ? `${titleParts.join(' | ')} - Next E-commerce`
      : '상품 목록 - Next E-commerce';

  return {
    title: fullTitle,
    description: `Next E-commerce 상품 검색 결과입니다. ${titleParts.join(', ') || '전체 상품을 확인해보세요.'}`,
    openGraph: {
      title: fullTitle,
      description: '검색 필터에 맞는 다양한 상품들을 만나보세요.',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/list`,
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: '검색 조건에 맞는 상품을 빠르게 확인하세요.',
    },
  };
}

export default async function ListPage({ searchParams }: Props) {
  const get = (k: string) => {
    const v = searchParams[k];
    return Array.isArray(v) ? v[0] : v || '';
  };

  const categoryId = get('category_id');
  const colors = searchParams.color
    ? Array.isArray(searchParams.color)
      ? searchParams.color
      : [searchParams.color]
    : [];
  const sizes = searchParams.size
    ? Array.isArray(searchParams.size)
      ? searchParams.size
      : [searchParams.size]
    : [];
  const minPrice = get('minPrice');
  const maxPrice = get('maxPrice');
  const order = get('order');
  const query = get('query');

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
