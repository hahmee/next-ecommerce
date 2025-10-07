'use client';

import {useCategoriesTable} from '@/hooks/useCategoriesTable';
import {CategoryTableView} from "@/components/Admin/Category/CategoryTableView";

export default function CategoryTable() {
  const categoriesTable = useCategoriesTable();
  return <CategoryTableView {...categoriesTable} />;
}
