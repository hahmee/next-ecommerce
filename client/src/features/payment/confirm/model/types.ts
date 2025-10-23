import type {Payment} from "@/entities/payment";

export type PaymentConfirmVM = {
  orderId: string;
  orderName: string;
  totalAmount: number;
  raw: Payment;
};
