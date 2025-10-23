'use client';

import { useCategoryForm } from '@/features/category/manage';
import { CategoryFormView } from '@/features/category/manage';
import { Mode } from '@/shared/constants/mode';

interface Props {
  type: Mode;
  id?: string;
}

export function CategoryForm({ type, id }: Props) {
  const form = useCategoryForm({ type, id });
  return <CategoryFormView {...form} />;
}
