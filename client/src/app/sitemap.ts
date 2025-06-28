//검색에 노출되었으면 하는 경로들만 쓰면 됨

import {MetadataRoute} from 'next'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "http://127.0.0.1:3000"
  // 1. 정적 페이지들(주소 고정)
  const staticPaths: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/list`, lastModified: new Date() },
  ]

  // 2. 동적 페이지들(주소가 동적으로 변경) — 상품 목록 (API 요청 or DB 등에서 가져오기)
  const products = await fetch(`${baseUrl}/api/public/products/newProductList`)
    .then(res => res.json())
    .catch(() => []);

  console.log('products...',products)
  //sitemap entry 형태로 가공
  const productPaths = products.map((p: any) => ({
    url: `${baseUrl}/product/${p.pno}`, // 각 상품 페이지
    lastModified: new Date(new Date()),
  }))

  //
  // // 3. 동적 페이지들 — 카테고리 목록
  // const categories = await fetch(`${baseUrl}/api/categories`) //
  //   .then(res => res.json())
  //   .catch(() => [])
  //
  // const categoryPaths = categories.map((c: any) => ({
  //   url: `${baseUrl}/categories/${c.slug}`, // 각 카테고리 페이지
  //   lastModified: new Date(c.updatedAt || new Date()),
  // }))

  return [...staticPaths, ...productPaths]
}
