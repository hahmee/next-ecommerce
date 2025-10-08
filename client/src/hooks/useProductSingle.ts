'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/interface/Product';
import type { Review } from '@/interface/Review';
import type { ColorTag } from '@/interface/ColorTag';
import { SalesStatus } from '@/types/salesStatus';
import {productApi} from "@/libs/services/productApi";
import {reviewApi} from "@/libs/services/reviewApi";

export function useProductSingle(id: string) {
  const productQuery = useQuery<Product>({
    queryKey: ['productCustomerSingle', id],
    queryFn: () =>
      productApi.byIdPublic(id, { next: { revalidate: 60, tags: ['productCustomerSingle', id] } }),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
    enabled: !!id,
  });

  const reviewsQuery = useQuery<Review[]>({
    queryKey: ['reviews', id],
    queryFn: () => reviewApi.listByProduct(id, { next: { revalidate: 60, tags: ['reviews', id] } }),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
    enabled: !!id,
  });

  const [color, setColor] = useState<ColorTag | null>(null);
  const [size, setSize] = useState<string>('');

  useEffect(() => {
    const p = productQuery.data;
    if (!p) return;
    setColor((prev) => prev ?? p.colorList?.[0] ?? null);
    setSize((prev) => prev || p.sizeList?.[0] || '');
  }, [productQuery.data]);

  const priceText = useMemo(() => {
    const price = productQuery.data?.price;
    return typeof price === 'number' ? price.toLocaleString() : '-';
  }, [productQuery.data?.price]);

  const salesStatus = productQuery.data?.salesStatus ?? SalesStatus.ONSALE;
  const sellerEmail = productQuery.data?.owner?.email ?? '';

  const resetOptions = useCallback(() => {
    const p = productQuery.data;
    setColor(p?.colorList?.[0] ?? null);
    setSize(p?.sizeList?.[0] ?? '');
  }, [productQuery.data]);

  return {
    productQuery,
    reviewsQuery,
    color, size, setColor, setSize, resetOptions,
    priceText, salesStatus, sellerEmail,
  } as const;
}
