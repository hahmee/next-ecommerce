'use client';
import { ProductFormView } from './ProductFormView';
import { Mode } from '@/types/mode';
import {useProductForm} from "@/hooks/useProductForm";

interface Props {
  type: Mode;
  id?: string;
}

export default function ProductForm({ type, id }: Props) {
  const form = useProductForm({ type, id });
  if (form.loading) return 'Loading...';
  return <ProductFormView {...form} />;
}
