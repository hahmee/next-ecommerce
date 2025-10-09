'use client';

import { useOrderDetail } from '@/hooks/useOrderDetail';
import { OrderDetailView } from './OrderDetailView';

export default function OrderDetail({ orderId }: { orderId: string }) {
  const orderDetail = useOrderDetail(orderId);
  return <OrderDetailView {...orderDetail} />;
}
