'use client';

import { useUserOrders } from '@/features/order/read';
import { UserOrdersView } from '@/widgets/home/profile';

export function UserOrders() {
  const userOrders = useUserOrders();
  return <UserOrdersView {...userOrders} />;
}
