'use client';

import { OrderTableView } from '@/components/Admin/Tables/OderTableView';
import { useOrdersTable } from '@/hooks/admin/table/useOrdersTable';

export default function OrderTable() {
  const ordersTable = useOrdersTable();
  return <OrderTableView {...ordersTable} />;
}
