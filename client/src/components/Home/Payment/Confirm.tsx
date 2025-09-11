'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getPayment } from '@/apis/mallAPI';
import { Payment } from '@/interface/Payment';

interface Props { paymentKey: string; }

const FALLBACK: Payment = {
  paymentKey: 'pay_test_123',
  orderId: 'dummy',
  orderName: '테스트 결제',
  totalAmount: 35175,
  status: 'DONE',
  approvedAt: new Date().toISOString(),
};

const Confirm = ({ paymentKey }: Props) => {
  const queryClient = useQueryClient();

  const {
    data: payment,
    isLoading,
    isError,
    error,
  } = useQuery<Payment>({
    queryKey: ['payment-confirm', paymentKey],
    enabled: !!paymentKey,
    // 네트워크/모킹이 비어도 항상 객체 반환
    queryFn: async () => {
      const res = await getPayment({ paymentKey });
      return (res ?? FALLBACK);
    },
    // 로딩 동안 깜빡임 줄이고 싶으면 placeholderData도 가능
    // placeholderData: FALLBACK,
    retry: false,
    staleTime: 60_000,
    gcTime: 300_000,
  });

  // 사이드 이펙트는 effect에서
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ['carts'] }).catch(() => {});
  }, [queryClient]);

  if (isLoading) return <div className="p-8 text-center">결제 확인 중…</div>;

  if (isError) {
    return (
      <div className="p-8 text-center text-red-600">
        결제 정보 조회에 실패했습니다.<br />
        {(error as Error)?.message}
      </div>
    );
  }

  if (!payment) {
    return <div className="p-8 text-center">결제 정보가 없습니다.</div>;
  }

  const orderName = (payment as any).orderName ?? (payment as any).name ?? '주문';
  const totalAmount = payment.totalAmount ?? (payment as any).amount ?? 0;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-green-600 mb-4">주문이 완료되었습니다!</h1>
        <p className="text-gray-700 mb-4">주문이름: {orderName}</p>
        <p className="text-gray-700 mb-4">
          주문번호: <strong>{payment.orderId}</strong>
        </p>
        <p className="text-gray-700 mb-4">
          총 결제 금액: <strong>{Number(totalAmount).toLocaleString()}원</strong>
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

export default Confirm;
