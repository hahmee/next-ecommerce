'use client';

import { usePaymentTable } from '@/widgets/admin/payments-table';
import { PaymentTableView } from '@/widgets/admin/payments-table';

export function PaymentTable() {
  const table = usePaymentTable();
  return <PaymentTableView {...table} />;
}
