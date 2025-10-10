'use client';

import { PaymentTableView } from '@/components/Admin/Tables/PaymentTableView';
import { usePaymentTable } from '@/hooks/admin/table/usePaymentTable';

export default function PaymentTable() {
  const table = usePaymentTable();
  return <PaymentTableView {...table} />;
}
