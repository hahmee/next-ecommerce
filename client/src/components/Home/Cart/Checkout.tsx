'use client';

import CartSummary from '@/components/Home/Cart/CartSummary';
import React, {useState} from 'react';
import {useCartStore} from '@/store/cartStore';
import {OrderStatus} from '@/types/orderStatus';
import {OrderRequest, OrderShippingAddressInfo} from '@/interface/Order';
import {loadTossPayments} from '@tosspayments/payment-sdk';
import {useCreateOrderMutation} from '@/hooks/useCreateOrderMutation';
import toast from 'react-hot-toast';

const Checkout = () => {
  const { carts, subtotal, tax, shippingFee, total } = useCartStore();
  const createOrder = useCreateOrderMutation();

  // 배송 정보 상태 관리
  const [shippingInfo, setShippingInfo] = useState<OrderShippingAddressInfo>({
    receiver: '',
    address: '',
    zipCode: '',
    phone: '',
    message: '',
  });

  // 폼 입력 변경 처리
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  // 결제 요청 처리
  const handlePaymentClick = async (event: React.FormEvent) => {
    event.preventDefault();
    const newOrderId = Math.random().toString(36).slice(2);

    const order: OrderRequest = {
      deliveryInfo: shippingInfo,
      carts,
      totalAmount: total,
      shippingFee,
      tax,
      status: OrderStatus.ORDER_CHECKING,
      orderId: newOrderId,
    };

    createOrder.mutate(order, {
      onSuccess: async () => {
        try {
          const tossPayments = await loadTossPayments(
            process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY as string,
          );
          await tossPayments.requestPayment('카드', {
            amount: total,
            orderId: newOrderId,
            orderName:
              carts.length > 1 ? `${carts[0].pname} 외 ${carts.length - 1}개` : `${carts[0].pname}`,
            customerName: '판매자_테스트',
            successUrl: process.env.NEXT_PUBLIC_TOSS_SUCCESS as string,
            failUrl: process.env.NEXT_PUBLIC_TOSS_FAIL as string,
          });
        } catch (error: any) {
          // 사용자가 결제를 취소하거나, 결제창 오류 등
          toast.error('Toss 결제 요청 실패 또는 취소');
          console.warn('Toss 결제 요청 실패 또는 취소:', error.message);
        }
      },
    });
  };

  return (
    <form onSubmit={handlePaymentClick}>
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
                onChange={handleInputChange}
                required
              />

              <label className="block mb-2 mt-4">주소</label>
              <input
                className="w-full p-2 border border-gray-300"
                type="text"
                name="address"
                value={shippingInfo.address}
                onChange={handleInputChange}
                required
              />

              <label className="block mb-2 mt-4">우편번호</label>
              <input
                className="w-full p-2 border border-gray-300"
                type="text"
                name="zipCode"
                value={shippingInfo.zipCode}
                onChange={handleInputChange}
                required
              />

              <label className="block mb-2 mt-4">전화번호</label>
              <input
                className="w-full p-2 border border-gray-300"
                type="tel"
                name="phone"
                value={shippingInfo.phone}
                onChange={handleInputChange}
                required
              />
              <label className="block mb-2 mt-4">배송메시지</label>
              <input
                className="w-full p-2 border border-gray-300"
                type="text"
                name="message"
                value={shippingInfo.message}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          {/* Cart Summary */}
          <CartSummary type="Payment" disabled={createOrder.isPending} />
        </div>
      </div>
    </form>
  );
};

export default Checkout;
