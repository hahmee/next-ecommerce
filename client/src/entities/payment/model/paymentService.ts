// src/entities/payment/model/paymentService.ts

'use client';

import { loadTossPayments } from '@tosspayments/payment-sdk';

export type CardPaymentInput = {
  amount: number;
  orderId: string;
  orderName: string;
  customerName: string;
  successUrl: string;
  failUrl: string;
};

export async function requestTossCardPayment(input: CardPaymentInput) {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
  if (!clientKey) {
    throw new Error('Missing NEXT_PUBLIC_TOSS_CLIENT_KEY');
  }
  const toss = await loadTossPayments(clientKey);
  await toss.requestPayment('카드', {
    amount: input.amount,
    orderId: input.orderId,
    orderName: input.orderName,
    customerName: input.customerName,
    successUrl: input.successUrl,
    failUrl: input.failUrl,
  });
}
