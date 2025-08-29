// 검색에 노출되었으면 하는 경로들만 쓰면 됨

import { MetadataRoute } from 'next';
import { Product } from '@/interface/Product';
import { getPublicCategories, getPublicNewProducts } from '@/apis/publicAPI';
import { Category } from '@/interface/Category';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // 1. 정적 페이지들(주소 고정)
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/list`, lastModified: new Date() },
  ];

  // 2. 동적 페이지들(주소가 동적으로 변경) — 상품 목록 (API 요청 or DB 등에서 가져오기)
  let products: Product[] = [];
  let categories: Category[] = [];

  try {
    products = await getPublicNewProducts();
    categories = await getPublicCategories();
  } catch (e) {
    console.error('Failed to fetch sitemap data:', e);
  }

  // sitemap entry 형태로 가공
  const productPaths = products.map((p) => ({
    url: `${baseUrl}/product/${p.pno}`, // 각 상품 페이지
    lastModified: new Date(new Date()),
  }));

  // sitemap entry 형태로 가공
  const categoryPaths = categories.map((c) => ({
    url: `${baseUrl}/list?category_id=${c.cno}`,
    lastModified: new Date(new Date()),
  }));

  return [...staticPaths, ...productPaths, ...categoryPaths];
}
