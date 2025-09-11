import { TossPaymentMethod, TossPaymentStatus, TossPaymentType } from '@/types/toss';
import { Member } from '@/interface/Member';
import { Order } from '@/interface/Order';

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
