'use client';
import { useProductsTable } from '@/hooks/useProductsTable';
import { ProductTableView } from './ProductTableView';

const ProductTable = () => {
  const table = useProductsTable();
  return <ProductTableView {...table} />;
};

export default ProductTable;