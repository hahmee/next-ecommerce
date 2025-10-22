// src/features/category/manage/ui/CategoryForm.tsx



'use client';

import { useCategoryForm } from '@/features/category/manage/model/useCategoryForm';
import { CategoryFormView } from '@/features/category/manage/ui/CategoryFormView';
import { Mode } from '@/shared/constants/mode';

interface Props {
  type: Mode;
  id?: string;
}

export default function CategoryForm({ type, id }: Props) {
  const form = useCategoryForm({ type, id });
  return <CategoryFormView {...form} />;
}
