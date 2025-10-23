// src/widgets/admin/stock-table/ui/StockTable.tsx

// src/widgets/admin/stock-table/ui/StockTable.tsx

'use client';

import { useStockTable } from '@/widgets/admin/stock-table/model/useStockTable';
import { StockTableView } from '@/widgets/admin/stock-table/ui/StockTableView';

export default function StockTable() {
  const stockTable = useStockTable();
  return <StockTableView {...stockTable} />;
}
