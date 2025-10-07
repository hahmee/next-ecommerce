'use client';

import { useOrdersTable } from '@/hooks/useOrdersTable';
import {OrderTableView} from "@/components/Admin/Tables/OderTableView";

export default function OrderTable() {
  const ordersTable = useOrdersTable();
  return <OrderTableView {...ordersTable} />;
}
