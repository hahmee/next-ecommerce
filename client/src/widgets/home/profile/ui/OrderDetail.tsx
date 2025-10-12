'use client';

import { useOrderDetail } from '@/hooks/home/order/useOrderDetail';

import { OrderDetailView } from './OrderDetailView';

export default function OrderDetail({ orderId }: { orderId: string }) {
  const orderDetail = useOrderDetail(orderId);
  return <OrderDetailView {...orderDetail} />;
}
