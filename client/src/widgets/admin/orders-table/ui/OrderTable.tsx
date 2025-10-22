// src/widgets/admin/orders-table/ui/OrderTable.tsx

﻿// src/widgets/admin/orders-table/ui/OrderTable.tsx


'use client';

import { useOrdersTable } from '@/widgets/admin/orders-table/model/useOrdersTable';
import { OrderTableView } from '@/widgets/admin/orders-table/ui/OrderTableView';

export default function OrderTable() {
  const ordersTable = useOrdersTable();
  return <OrderTableView {...ordersTable} />;
}
