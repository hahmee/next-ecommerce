// src/widgets/admin/categories-table/ui/CategoryTable.tsx



'use client';

import { CategoryTableView } from '@/entities/category/ui/CategoryTableView';
import { useCategoriesTable } from '@/widgets/admin/categories-table/model/useCategoriesTable';

export default function CategoryTable() {
  const categoriesTable = useCategoriesTable();
  return <CategoryTableView {...categoriesTable} />;
}
