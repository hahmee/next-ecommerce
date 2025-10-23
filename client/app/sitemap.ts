// app/sitemap.ts

// app/sitemap.ts

import { MetadataRoute } from 'next';

import { categoryApi } from '@/entities/category/api/categoryApi';
import { Category } from '@/entities/category/model/types';
import { productApi } from '@/entities/product/api/productApi';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const now = new Date();

  // 1. 정적 페이지들(주소 고정)
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/list`, lastModified: new Date() },
  ];

  // 2. 동적 페이지들(주소가 동적으로 변경) — 상품 목록 (API 요청 or DB 등에서 가져오기)
  let pnoList: number[] = [];
  let categories: Category[] = [];

  try {
    pnoList = await productApi.allIds();
    categories = await categoryApi.listPublic();
  } catch (e) {
    console.error('Failed to fetch sitemap data:', e);
  }

  // sitemap entry 형태로 가공
  const productPaths = pnoList.map((p) => ({
    url: `${baseUrl}/product/${p}`, // 각 상품 페이지
    lastModified: now,
  }));

  const categoryPaths = categories.map((c) => ({
    url: `${baseUrl}/list?category_id=${c.cno}`,
    lastModified: now,
  }));

  return [...staticPaths, ...productPaths, ...categoryPaths];
}
