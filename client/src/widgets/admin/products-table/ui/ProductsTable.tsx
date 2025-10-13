'use client';
import { useProductsTable } from '@/widgets/admin/products-table/model/useProductsTable';
import { ProductTableView } from '@/widgets/admin/products-table/ui/ProductsTableView';

const ProductTable = () => {
  const table = useProductsTable();
  return <ProductTableView {...table} />;
};

export default ProductTable;
