'use client';

import { useStockTable } from '@/widgets/admin/stock-table/model/useStockTable';
import { StockTableView } from '@/widgets/admin/stock-table/ui/StockTableView';

export function StockTable() {
  const stockTable = useStockTable();
  return <StockTableView {...stockTable} />;
}
