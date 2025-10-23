// src/entities/product/ui/ProductSingle.tsx

'use client';

import { ProductSingleView } from '@/entities/product/ui/ProductSingleView';
import { useProductSingle } from '@/features/product/read/model/useProductSingle';

interface Props {
  id: string;
}

export default function ProductSingle({ id }: Props) {
  const product = useProductSingle(id);
  return <ProductSingleView {...product} id={id} />;
}
