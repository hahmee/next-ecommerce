// src/widgets/admin/payment-overview/ui/PaymentOverview.tsx

﻿// src/widgets/admin/payment-overview/ui/PaymentOverview.tsx

'use client';

import { usePaymentOverview } from '@/features/dashboard/model/usePaymentOverview';
import { PaymentOverviewView } from '@/widgets/admin/payment-overview/ui/PaymentOverviewView';

export default function PaymentOverview() {
  const paymentOverview = usePaymentOverview();
  return <PaymentOverviewView {...paymentOverview} />;
}
