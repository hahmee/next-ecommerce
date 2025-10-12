'use client';
import { useProductForm } from '@/hooks/admin/product/useProductForm';
import { Mode } from '@/entities/common/model/mode';

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
