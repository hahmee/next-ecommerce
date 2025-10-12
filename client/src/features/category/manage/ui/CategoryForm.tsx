'use client';

import { useCategoryForm } from '@/features/category/manage/model/useCategoryForm';
import { Mode } from '@/entities/common/model/mode';

import { CategoryFormView } from './CategoryFormView';

interface Props {
  type: Mode;
  id?: string;
}

export default function CategoryForm({ type, id }: Props) {
  const form = useCategoryForm({ type, id });
  return <CategoryFormView {...form} />;
}
