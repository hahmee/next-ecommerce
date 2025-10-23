'use client';
import { useProductsTable } from '@/widgets/admin/products-table/model/useProductsTable';
import { ProductTableView } from '@/widgets/admin/products-table/ui/ProductsTableView';

export const ProductTable = () => {
  const table = useProductsTable();
  return <ProductTableView {...table} />;
};

