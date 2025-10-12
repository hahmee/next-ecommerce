'use client';
import { useProductForm } from '@/features/product/admin/product-create/model/useProductForm';
import { Mode } from '@/types/mode';

import { ProductFormView } from './ProductFormView';

interface Props {
  type: Mode;
  id?: string;
}

export default function ProductForm({ type, id }: Props) {
  const form = useProductForm({ type, id });
  if (form.loading) return 'Loading...';
  return <ProductFormView {...form} />;
}
