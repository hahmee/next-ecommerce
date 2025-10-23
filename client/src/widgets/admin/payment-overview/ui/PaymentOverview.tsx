'use client';

import { usePaymentOverview } from '@/features/dashboard';
import { PaymentOverviewView } from '@/widgets/admin/payment-overview';

export function PaymentOverview() {
  const paymentOverview = usePaymentOverview();
  return <PaymentOverviewView {...paymentOverview} />;
}
