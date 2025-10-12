'use client';

import { CategoryTableView } from '@/components/Admin/Category/CategoryTableView';
import { useCategoriesTable } from '@/widgets/admin/categories-table/model/useCategoriesTable';

export default function CategoryTable() {
  const categoriesTable = useCategoriesTable();
  return <CategoryTableView {...categoriesTable} />;
}

