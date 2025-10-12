'use client';

import { useCategoryForm } from '@/hooks/admin/category/useCategoryForm';
import { Mode } from '@/types/mode';

import { CategoryFormView } from './CategoryFormView';

interface Props {
  type: Mode;
  id?: string;
}

export default function CategoryForm({ type, id }: Props) {
  const form = useCategoryForm({ type, id });
  return <CategoryFormView {...form} />;
}
