'use client';

import { useOrderDetail } from '@/features/order/read/model/useOrderDetail';

import { OrderDetailView } from './OrderDetailView';

export default function OrderDetail({ orderId }: { orderId: string }) {
  const orderDetail = useOrderDetail(orderId);
  return <OrderDetailView {...orderDetail} />;
}
