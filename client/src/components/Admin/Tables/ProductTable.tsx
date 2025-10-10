'use client';
import { useProductsTable } from '@/hooks/admin/table/useProductsTable';

import { ProductTableView } from './ProductTableView';

const ProductTable = () => {
  const table = useProductsTable();
  return <ProductTableView {...table} />;
};

export default ProductTable;
