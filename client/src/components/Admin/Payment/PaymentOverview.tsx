'use client';

import { usePaymentOverview } from '@/hooks/admin/dashboard/usePaymentOverview';

import { PaymentOverviewView } from './PaymentOverviewView';

export default function PaymentOverview() {
  const paymentOverview = usePaymentOverview();
  return <PaymentOverviewView {...paymentOverview} />;
}
