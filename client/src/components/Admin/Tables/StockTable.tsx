'use client';

import { useStockTable } from '@/hooks/useStockTable';
import { StockTableView } from './StockTableView';

export default function StockTable() {
  const stockTable = useStockTable();
  return <StockTableView {...stockTable} />;
}
