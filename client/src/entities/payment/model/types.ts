import { TossPaymentMethod, TossPaymentStatus, TossPaymentType } from '@/shared/model/toss';
import { Member } from '@/entities/member/model/Member';
import { Order } from '@/entities/order/model/types';

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
