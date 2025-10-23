// src/features/checkout/ui/CheckoutView.tsx

﻿// src/features/checkout/ui/CheckoutView.tsx



'use client';

import React from 'react';

import CartSummary from '@/entities/cart/ui/CartSummary';
import type { OrderShippingAddressInfo } from '@/entities/order/model/types';

type Props = {
  shippingInfo: OrderShippingAddressInfo;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  disabled?: boolean;
};

export default function CheckoutView({ shippingInfo, onChange, onSubmit, disabled }: Props) {
  return (
    <form onSubmit={onSubmit}>
      <div className="bg-gray-50 min-h-screen">
        <div className="bg-white py-4">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-semibold">Payment</h1>
          </div>
        </div>

        <div className="mb-6 p-3 bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 rounded">
          ※ 본 결제는 테스트용으로 실제 금액이 청구되지 않습니다.
          <br />
          안심하고 진행해 주세요.
        </div>

        <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-2/3 bg-white p-6 shadow-sm rounded-lg">
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">배송 정보</h2>

              <label className="block mb-2">이름</label>
              <input
                className="w-full p-2 border border-gray-300"
                type="text"
                name="receiver"
                value={shippingInfo.receiver}
                onChange={onChange}
                required
              />

              <label className="block mb-2 mt-4">주소</label>
              <input
                className="w-full p-2 border border-gray-300"
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={onChange}
                required
              />

              <label className="block mb-2 mt-4">우편번호</label>
              <input
                className="w-full p-2 border border-gray-300"
                type="text"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={onChange}
                required
              />

              <label className="block mb-2 mt-4">전화번호</label>
              <input
                className="w-full p-2 border border-gray-300"
                type="tel"
                name="phone"
                value={shippingInfo.phone}
                onChange={onChange}
                required
              />

              <label className="block mb-2 mt-4">배송메시지</label>
              <input
                className="w-full p-2 border border-gray-300"
                type="text"
                name="message"
                value={shippingInfo.message}
                onChange={onChange}
                required
              />
            </div>
          </div>

          {/* Summary는 그대로 재사용 */}
          <CartSummary type="Payment" disabled={disabled} />
        </div>
      </div>
    </form>
  );
}
