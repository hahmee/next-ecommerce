'use client';

import { ProductSingleView } from '@/components/Home/Product/ProductSingleView';
import { useProductSingle } from 'src/features/product/create/model/useProductSingle';

interface Props {
  id: string;
}

export default function ProductSingle({ id }: Props) {
  const product = useProductSingle(id);
  return <ProductSingleView {...product} id={id} />;
}
