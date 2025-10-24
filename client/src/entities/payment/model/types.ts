import { Member } from '@/entities/member';
import { Order } from '@/entities/order';
import {
  TossPaymentMethod,
  TossPaymentStatus,
  TossPaymentType,
} from '@/entities/payment/consts/toss';

export type Payment = {
  id: number;
  owner: Member;
  paymentKey: string;
  orderId: string;
  orderName: string;
  method: TossPaymentMethod;
  totalAmount: number;
  status: TossPaymentStatus;
  type: TossPaymentType;
  createdAt: string;
  updatedAt: string;
  orders?: Array<Order>;
  itemLength?: number;
};

export type PaymentFallback = Pick<
  Payment,
  'paymentKey' | 'orderId' | 'orderName' | 'totalAmount' | 'status'
>;
