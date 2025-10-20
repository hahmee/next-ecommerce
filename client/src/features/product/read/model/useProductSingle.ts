// src/features/product/read/model/useProductSingle.ts

'use client';

import { useQuery } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import { productApi } from '@/entities/product/api/productApi';
import { SalesStatus } from '@/entities/product/consts/SalesStatus';
import type { Product } from '@/entities/product/model/types';
import { reviewApi } from '@/entities/review/api/reviewApi';
import type { Review } from '@/entities/review/model/types';
import type { ColorTag } from '@/shared/model/ColorTag';

const EMPTY_COLOR: ColorTag = { id: 0, text: '', color: '' };

export function useProductSingle(id: string) {
  const productQuery = useQuery<Product>({
    queryKey: ['productCustomerSingle', id],
    queryFn: () =>
      productApi.byIdPublic(id, {
        next: { revalidate: 60, tags: ['productCustomerSingle', id] },
      }),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
    enabled: !!id,
  });

  const reviewsQuery = useQuery<Review[]>({
    queryKey: ['reviews', id],
    queryFn: () =>
      reviewApi.listByProduct(id, {
        next: { revalidate: 60, tags: ['reviews', id] },
      }),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: false,
    enabled: !!id,
  });

  const product = productQuery.data;
  const reviews = reviewsQuery.data;

  const [color, setColor] = useState<ColorTag>(EMPTY_COLOR);
  const [size, setSize] = useState<string>('');

  // 제품 바뀌면 목록 기준으로 유효 값 세팅 (없으면 안전 기본값 유지)
  useEffect(() => {
    if (!product) return;

    if (product.colorList?.length) {
      const stillValid = product.colorList.some(
        (c) => c.id === color.id && c.text === color.text && c.color === color.color,
      );
      if (!stillValid) setColor(product.colorList[0]);
    } else {
      setColor(EMPTY_COLOR);
    }

    if (product.sizeList?.length) {
      const stillValid = product.sizeList.includes(size);
      if (!stillValid) setSize(product.sizeList[0]);
    } else {
      setSize('');
    }
  }, [product]);

  const priceText = useMemo(() => {
    const price = product?.price;
    return typeof price === 'number' ? price.toLocaleString() : '-';
  }, [product?.price]);

  const salesStatus = product?.salesStatus ?? SalesStatus.ONSALE;
  const sellerEmail = product?.owner?.email ?? '';

  return {
    product,
    reviews,
    priceText,
    color,
    size,
    setColor,
    setSize,
    salesStatus,
    sellerEmail,
  } as const;
}
