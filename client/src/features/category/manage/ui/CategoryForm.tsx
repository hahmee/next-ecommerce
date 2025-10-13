'use client';

import { Mode } from '@/entities/common/model/mode';
import { useCategoryForm } from '@/features/category/manage/model/useCategoryForm';
import {CategoryFormView} from "@/features/category/manage/ui/CategoryFormView";


interface Props {
  type: Mode;
  id?: string;
}

export default function CategoryForm({ type, id }: Props) {
  const form = useCategoryForm({ type, id });
  return <CategoryFormView {...form} />;
}
