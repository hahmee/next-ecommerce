'use client';

import { useUserOrders } from '@/hooks/home/order/useUserOrders';

import { UserOrdersView } from './UserOrdersView';

export default function UserOrders() {
  const userOrders = useUserOrders();
  return <UserOrdersView {...userOrders} />;
}
