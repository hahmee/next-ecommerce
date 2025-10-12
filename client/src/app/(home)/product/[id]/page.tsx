import type { Metadata } from 'next';
import React, { Suspense } from 'react';

import ProductSingle from '@/entities/product/ui/ProductSingle';
import ProductSingleSkeleton from '@/entities/common/ui/Skeletons/ProductSingleSkeleton';
import { PrefetchBoundary } from '@/features/common/model/PrefetchBoundary';
import { productApi } from '@/entities/product/model/service';
import { reviewApi } from '@/entities/review/model/service';

interface Props {
  params: { id: string };
}
const stripHtml = (html?: string) => (html ?? '').replace(/<[^>]*>/g, '').trim();

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;

  const product = await productApi
    .byIdPublic(id, {
      next: { revalidate: 60, tags: ['productCustomerSingle', id] },
    })
    .catch(() => null);

  const productName = product?.pname ?? '상품 정보';
  const description =
    stripHtml(product?.pdesc) || 'Next E-commerce의 다양한 상품 정보를 확인해보세요.';
  const imageUrl = product?.uploadFileNames?.[0]?.file;

  return {
    title: `${productName} - Next E-commerce`,
    description,
    openGraph: {
      title: productName,
      description,
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`,
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 600, alt: productName }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: productName,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ProductSinglePage({ params }: Props) {
  const { id } = params;

  const prefetchOptions = [
    {
      queryKey: ['productCustomerSingle', id],
      queryFn: () =>
        productApi.byIdPublic(id, {
          next: { revalidate: 60, tags: ['productCustomerSingle', id] },
        }),
    },
    {
      queryKey: ['reviews', id],
      queryFn: () =>
        reviewApi.listByProduct(id, {
          next: { revalidate: 60, tags: ['reviews', id] },
        }),
    },
  ];

  return (
    <Suspense fallback={<ProductSingleSkeleton />}>
      <PrefetchBoundary prefetchOptions={prefetchOptions}>
        <ProductSingle id={id} />
      </PrefetchBoundary>
    </Suspense>
  );
}
