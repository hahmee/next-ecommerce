'use client';

import { usePaymentOverview } from '@/features/dashboard/model/usePaymentOverview';

import { PaymentOverviewView } from './PaymentOverviewView';

export default function PaymentOverview() {
  const paymentOverview = usePaymentOverview();
  return <PaymentOverviewView {...paymentOverview} />;
}
