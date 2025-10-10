import React from 'react';
import ReviewModalPage from '@/app/(home)/@modal/(.)add-reveiw/[id]/page';
import OrderPage from '@/app/(home)/order/[orderId]/page';

interface Props {
  searchParams: { [key: string]: string };
}

export default function AddReviewPage({ searchParams }: Props) {
  const { oid, orderId } = searchParams;

  return (
    <>
      <OrderPage params={{ orderId }} />
      <ReviewModalPage params={{ id: oid, orderId }} />
    </>
  );
}
