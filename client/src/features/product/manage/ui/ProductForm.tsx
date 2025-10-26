'use client';
import { useProductForm } from '@/features/product/manage';
import { ProductFormView } from '@/features/product/manage';
import { Mode } from '@/shared/constants/mode';

interface Props {
  type: Mode;
  id?: string;
}

export function ProductForm({ type, id }: Props) {
  const form = useProductForm({ type, id });
  console.log('form..', form);
  if (form.loading) return 'Loading...';
  return <ProductFormView {...form} />;
}
