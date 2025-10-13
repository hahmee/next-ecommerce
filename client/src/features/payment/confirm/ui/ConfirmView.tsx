'use client';

import Link from 'next/link';
import React from 'react';

import type { PaymentConfirmVM } from '@/features/payment/confirm/model/usePaymentConfirm';

interface Props {
  payment: PaymentConfirmVM;
}

const ConfirmView = ({ payment }: Props) => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">주문이 완료되었습니다!</h1>
        <p className="text-gray-700 mb-4">주문이름: {payment.orderName}</p>
        <p className="text-gray-700 mb-4">
          주문번호: <strong>{payment.orderId}</strong>
        </p>
        <p className="text-gray-700 mb-4">
          총 결제 금액: <strong>{payment.totalAmount.toLocaleString()}원</strong>
        </p>

        <div className="flex flex-col space-y-4">
          <Link href="/" prefetch={false}>
            <div className="w-full text-center text-sm rounded-md ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white">
              계속 쇼핑하기
            </div>
          </Link>
          <Link href={`/order/${payment.orderId}`} prefetch={false}>
            <div className="w-full text-center text-sm rounded-md ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white">
              주문 내역 확인하기
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ConfirmView;
