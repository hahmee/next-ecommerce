'use client';
import { useProductsTable } from 'src/features/product/create/model/useProductsTable';

import { ProductTableView } from './ProductTableView';

const ProductTable = () => {
  const table = useProductsTable();
  return <ProductTableView {...table} />;
};

export default ProductTable;
