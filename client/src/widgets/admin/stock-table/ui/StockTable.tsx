'use client';

import { useStockTable } from '@/widgets/admin/stock-table/model/useStockTable';

import { StockTableView } from './StockTableView';

export default function StockTable() {
  const stockTable = useStockTable();
  return <StockTableView {...stockTable} />;
}

