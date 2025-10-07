'use client';

import { usePaymentTable } from '@/hooks/usePaymentTable';
import {PaymentTableView} from "@/components/Admin/Tables/PaymentTableView";

export default function PaymentTable() {
  const table = usePaymentTable();
  return <PaymentTableView {...table} />;
}
