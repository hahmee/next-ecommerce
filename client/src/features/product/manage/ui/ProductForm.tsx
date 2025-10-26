'use client';
import { useProductForm } from '@/features/product/manage';
import { ProductFormView } from '@/features/product/manage';
import { Mode } from '@/shared/constants/mode';
import { Product } from '@/entities/product';

interface Props {
  type: Mode;
  id?: string;
  initialProduct?: Product;
}

export function ProductForm({ type, id, initialProduct }: Props) {
  const form = useProductForm({ type, id, initialProduct });
  if (form.loading) return 'Loading...';
  return <ProductFormView {...form} />;
}
