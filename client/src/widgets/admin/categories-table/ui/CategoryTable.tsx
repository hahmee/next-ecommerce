'use client';

import { CategoryTableView } from '@/entities/category';
import { useCategoriesTable } from '@/widgets/admin/categories-table';

export function CategoryTable() {
  const categoriesTable = useCategoriesTable();
  return <CategoryTableView {...categoriesTable} />;
}
