'use client';
import { ProductFormView } from './ProductFormView';
import { Mode } from '@/types/mode';
import {useProductForm} from "@/hooks/useProductForm";

interface Props {
  type: Mode;
  id?: string;
}

export default function ProductForm({ type, id }: Props) {
  const vm = useProductForm({ type, id }); // 상태/핸들러/데이터 묶음
  if (vm.loading) return 'Loading...';
  return <ProductFormView {...vm} />;
}
