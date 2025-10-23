'use client';

import { usePaymentOverview } from '@/features/dashboard';
import { PaymentOverviewView } from '@/widgets/admin/payment-overview/ui/PaymentOverviewView';

export function PaymentOverview() {
  const paymentOverview = usePaymentOverview();
  return <PaymentOverviewView {...paymentOverview} />;
}
