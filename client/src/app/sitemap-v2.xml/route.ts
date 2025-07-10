import {Product} from '@/interface/Product';
import {Category} from '@/interface/Category';
import {getPublicCategories, getPublicNewProducts} from '@/apis/publicAPI';

export const runtime = 'nodejs';   // edge → nodejs 로 변경

  export async function GET() {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
    const staticUrls = [
      `${baseUrl}/`,
      `${baseUrl}/list`,
    ];

    let products: Product[] = [];
    let categories: Category[] = [];

    try {
      [products, categories] = await Promise.all([
        getPublicNewProducts(),
        getPublicCategories(),
      ]);
    } catch (e) {
      console.error('sitemap-v2 fetch error', e);
    }

    const dynamicUrls = [
      ...products.map(p => `${baseUrl}/product/${p.pno}`),
      ...categories.map(c => `${baseUrl}/category/${c.cno}`),
    ];

    const urls = [...staticUrls, ...dynamicUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
      .map(
        u => `<url><loc>${u}</loc><lastmod>${new Date().toISOString()}</lastmod></url>`
      )
      .join('\n')}
  </urlset>`;

    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
      },
    });
  }
