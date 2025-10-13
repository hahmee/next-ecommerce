'use client';

import { useUserOrders } from '@/features/order/read/model/useUserOrders';
import {UserOrdersView} from "@/widgets/home/profile/ui/UserOrdersView";


export default function UserOrders() {
  const userOrders = useUserOrders();
  return <UserOrdersView {...userOrders} />;
}
