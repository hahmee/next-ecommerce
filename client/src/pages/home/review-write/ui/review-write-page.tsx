// src/pages/home/review-write/ui/review-write-page.tsx

// src/pages/(home)/review-write/index.tsx

import React from 'react';

import OrderPage from '@/app/(home)/order/[orderId]/page';
import { ReviewModalPage } from '@/pages/home/modal/add-review';

export function AddReviewPage({ oid, orderId }: { oid: string; orderId: string }) {
  return (
    <>
      <OrderPage params={{ orderId }} />
      <ReviewModalPage params={{ id: oid, orderId }} />
    </>
  );
}
