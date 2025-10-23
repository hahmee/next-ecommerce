// app/(home)/list/page.tsx
import type { Metadata } from 'next';

import { categoryApi } from '@/entities/category';
import { ListPage } from '@/pages/home/list';

interface SearchParams {
  [key: string]: string | string[] | undefined;
}

function get(sp: SearchParams, k: string) {
  const v = sp[k];
  return Array.isArray(v) ? v[0] : v || '';
}

function getArray(sp: SearchParams, k: string) {
  const v = sp[k];
  return Array.isArray(v) ? v : v ? [v] : [];
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const query = get(searchParams, 'query');
  const categoryId = get(searchParams, 'category_id');

  let categoryName = '';
  try {
    if (categoryId) {
      const categoryRes = await categoryApi.byIdPublic(categoryId);
      categoryName = categoryRes?.cname || '전체';
    }
  } catch (e) {
    console.error('category fetch error:', e);
  }

  const filterSummary = Object.entries(searchParams)
    .filter(([k, v]) => k !== 'query' && k !== 'category_id' && (Array.isArray(v) ? v.length : !!v))
    .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
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

export default function Page({ searchParams }: { searchParams: SearchParams }) {
  // app 레이어에서 파싱해서 프리젠테이션 레이어로 전달
  const props = {
    categoryId: get(searchParams, 'category_id'),
    colors: getArray(searchParams, 'color'),
    sizes: getArray(searchParams, 'size'),
    minPrice: get(searchParams, 'minPrice'),
    maxPrice: get(searchParams, 'maxPrice'),
    order: get(searchParams, 'order'),
    query: get(searchParams, 'query'),
  };

  return <ListPage {...props} />;
}
