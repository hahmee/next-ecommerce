'use client';

import { OrderDetailView } from '@/entities/order';
import { useOrderDetail } from '@/features/order/read/model/useOrderDetail';

export default function OrderDetail({ orderId }: { orderId: string }) {
  const orderDetail = useOrderDetail(orderId);
  return <OrderDetailView {...orderDetail} />;
}
