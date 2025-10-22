// src/widgets/admin/payments-table/ui/PaymentTable.tsx



'use client';

import { usePaymentTable } from '@/widgets/admin/payments-table/model/usePaymentTable';
import { PaymentTableView } from '@/widgets/admin/payments-table/ui/PaymentTableView';

export default function PaymentTable() {
  const table = usePaymentTable();
  return <PaymentTableView {...table} />;
}
