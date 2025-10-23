'use client';
import { useProductsTable } from '@/widgets/admin/products-table';
import { ProductTableView } from '@/widgets/admin/products-table';

export const ProductTable = () => {
  const table = useProductsTable();
  return <ProductTableView {...table} />;
};

