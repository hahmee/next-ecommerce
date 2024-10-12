import {OrderStatus} from "@/types/orderStatus";
import {CartItemList} from "@/interface/CartItemList";
import {Member} from "@/interface/Member";
import {ColorTag} from "@/interface/ColorTag";

export interface Order {
  id: number;
  owner: Member;
  orderId: string;
  totalAmount: number;
  status: OrderStatus;
  deliveryInfo: OrderShippingAddressInfo;
  productInfo: OrderProductInfo;
  createdAt: string;
  updatedAt: string;
}


export interface OrderRequest {
  id?: number;
  orderId: string;
  totalAmount: number;
  status: OrderStatus;
  deliveryInfo: OrderShippingAddressInfo;
  carts?: Array<CartItemList>;
}

export interface OrderShippingAddressInfo {
  receiver: string;
  phone: string;
  zipCode: string;
  address: string;
  message: string;
}

export interface OrderProductInfo {
  pno: number;
  pname: string;
  qty: number;
  price: number;
  size: string;
  color: ColorTag;
  thumbnailUrl: string;
}