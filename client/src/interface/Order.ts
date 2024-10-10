import {OrderStatus} from "@/types/orderStatus";
import {ColorTag} from "@/interface/ColorTag";
import {CartItemList} from "@/interface/CartItemList";

export interface Order {
  id?: number;
  orderId: string;
  totalAmount: number;
  status: OrderStatus;
  deliveryInfo: OrderShippingAddressInfo;
  // productInfo: OrderProductInfo;
  carts?: Array<CartItemList>;
}

export interface OrderShippingAddressInfo {
  receiver: string;
  phone: string;
  zipCode: string;
  address: string;
  message: string;
}
//
// export interface OrderProductInfo {
//   pno: number;
//   pname: string;
//   qty: number;
//   price: number;
//   size: string;
//   color: ColorTag;
// }