'use client';
import { Mode } from '@/entities/common/model/mode';
import {useProductForm} from "@/features/product/manage/model/useProductForm";
import {ProductFormView} from "@/features/product/manage/ui/ProductFormView";


interface Props {
  type: Mode;
  id?: string;
}

export default function ProductForm({ type, id }: Props) {
  const form = useProductForm({ type, id });
  if (form.loading) return 'Loading...';
  return <ProductFormView {...form} />;
}
