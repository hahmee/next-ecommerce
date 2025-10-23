// src/entities/product/ui/ProductList.tsx

﻿// src/entities/product/ui/ProductList.tsx


'use client';

import React from 'react';

import { ProductListView } from '@/entities/product/ui/ProductListView';
import { useProductList } from '@/features/product/read/model/useProductList';

type Props = {
  categoryId?: string;
  colors: string[];
  sizes: string[];
  minPrice: string;
  maxPrice: string;
  order: string;
  query: string;
};

export default function ProductList(props: Props) {
  const productList = useProductList({
    categoryId: props.categoryId,
    colors: props.colors,
    sizes: props.sizes,
    minPrice: props.minPrice,
    maxPrice: props.maxPrice,
    order: props.order,
    query: props.query,
    row: 2,
  });

  return <ProductListView {...productList} />;
}
