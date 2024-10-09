import {OrderStatus} from "@/types/orderStatus";

export interface Order {
  id?: number;
  orderId: number;
  totalAmount: number;
  status: OrderStatus;
  deliveryInfo: OrderShippingAddressInfo;
}

export interface OrderShippingAddressInfo {
  receiver: string;
  phone: string;
  zipCode: string;
  address: string;
  message: string;
}