'use client';
import { useProductForm } from '@/features/product/manage/model/useProductForm';
import { ProductFormView } from '@/features/product/manage/ui/ProductFormView';
import { Mode } from '@/shared/constants/mode';

interface Props {
  type: Mode;
  id?: string;
}

export default function ProductForm({ type, id }: Props) {
  const form = useProductForm({ type, id });
  if (form.loading) return 'Loading...';
  return <ProductFormView {...form} />;
}
