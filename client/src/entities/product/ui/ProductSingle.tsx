'use client';

import { ProductSingleView } from '@/entities/product';
import { useProductSingle } from '@/features/product/read';

interface Props {
  id: string;
}

export function ProductSingle({ id }: Props) {
  const product = useProductSingle(id);
  return <ProductSingleView {...product} id={id} />;
}
