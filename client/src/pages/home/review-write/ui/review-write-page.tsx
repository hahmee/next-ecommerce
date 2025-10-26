import React from 'react';

import OrderPage from '@/app/(home)/order/[orderId]/page';
import {ReviewModalPage} from '@/pages/home/modal/add-review';

export function AddReviewPage({ oid, orderId }: { oid: string; orderId: string }) {

  return (
    <>
      <OrderPage params={{ orderId }} />
      <ReviewModalPage params={{ id: oid, orderId }} />
    </>
  );
}
