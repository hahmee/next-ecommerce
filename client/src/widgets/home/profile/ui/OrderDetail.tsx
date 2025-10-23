// src/widgets/home/profile/ui/OrderDetail.tsx

'use client';

import { OrderDetailView } from '@/entities/order/ui/OrderDetailView';
import { useOrderDetail } from '@/features/order/read/model/useOrderDetail';

export default function OrderDetail({ orderId }: { orderId: string }) {
  const orderDetail = useOrderDetail(orderId);
  return <OrderDetailView {...orderDetail} />;
}
