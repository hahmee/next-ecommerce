'use client';

import { useUserOrders } from '@/features/order/read/model/useUserOrders';

import { UserOrdersView } from './UserOrdersView';

export default function UserOrders() {
  const userOrders = useUserOrders();
  return <UserOrdersView {...userOrders} />;
}
