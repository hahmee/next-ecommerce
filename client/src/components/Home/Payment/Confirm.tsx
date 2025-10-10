'use client';

import React from 'react';
import { usePaymentConfirm } from '@/hooks/usePaymentConfirm';
import ConfirmView from './ConfirmView';

interface Props { paymentKey: string; }

const Confirm = ({ paymentKey }: Props) => {
  const { data: payment, isLoading, isError, error } = usePaymentConfirm(paymentKey);

  if (isLoading) return <div className="p-8 text-center">결제 확인 중…</div>;
  if (isError) {
    return (
      <div className="p-8 text-center text-red-600">
        결제 정보 조회에 실패했습니다.
        <br />
        {(error as Error)?.message}
      </div>
    );
  }
  if (!payment) return <div className="p-8 text-center">결제 정보가 없습니다.</div>;

  return <ConfirmView payment={payment} />;
};

export default Confirm;
