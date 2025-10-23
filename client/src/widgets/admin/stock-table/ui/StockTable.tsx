'use client';

import { useStockTable } from '@/widgets/admin/stock-table';
import { StockTableView } from '@/widgets/admin/stock-table';

export function StockTable() {
  const stockTable = useStockTable();
  return <StockTableView {...stockTable} />;
}
