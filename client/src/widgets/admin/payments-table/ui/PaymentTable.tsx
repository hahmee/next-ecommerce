'use client';

import { PaymentTableView } from '@/widgets/admin/payments-table/ui/PaymentTableView';
import { usePaymentTable } from '@/widgets/admin/payments-table/model/usePaymentTable';

export default function PaymentTable() {
  const table = usePaymentTable();
  return <PaymentTableView {...table} />;
}

