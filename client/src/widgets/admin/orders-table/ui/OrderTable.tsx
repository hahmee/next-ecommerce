'use client';

import { OrderTableView } from '@/components/Admin/Tables/OderTableView';
import { useOrdersTable } from '@/widgets/admin/orders-table/model/useOrdersTable';

export default function OrderTable() {
  const ordersTable = useOrdersTable();
  return <OrderTableView {...ordersTable} />;
}

