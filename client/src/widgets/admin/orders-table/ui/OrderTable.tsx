'use client';

import { useOrdersTable } from '@/widgets/admin/orders-table';
import { OrderTableView } from '@/widgets/admin/orders-table';

export function OrderTable() {
  const ordersTable = useOrdersTable();
  return <OrderTableView {...ordersTable} />;
}
