'use client';

import { Mode } from '@/types/mode';
import { useCategoryForm } from '@/hooks/useCategoryForm';
import { CategoryFormView } from './CategoryFormView';

interface Props { type: Mode; id?: string }

export default function CategoryForm({ type, id }: Props) {
  const form = useCategoryForm({ type, id });
  return <CategoryFormView {...form} />;
}
