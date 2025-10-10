'use client';

import { CategoryTableView } from '@/components/Admin/Category/CategoryTableView';
import { useCategoriesTable } from '@/hooks/admin/table/useCategoriesTable';

export default function CategoryTable() {
  const categoriesTable = useCategoriesTable();
  return <CategoryTableView {...categoriesTable} />;
}
