'use client';
import { useProductsTable } from '@/widgets/admin/products-table/model/useProductsTable';

import { ProductTableView } from './ProductTableView';

const ProductTable = () => {
  const table = useProductsTable();
  return <ProductTableView {...table} />;
};

export default ProductTable;

