'use client';

import { useOrdersTable } from '@/widgets/admin/orders-table/model/useOrdersTable';
import { OrderTableView } from '@/widgets/admin/orders-table/ui/OrderTableView';

export function OrderTable() {
  const ordersTable = useOrdersTable();
  return <OrderTableView {...ordersTable} />;
}
