'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

import { OrderStatus } from '@/entities/order';
import { OrderRequest, OrderShippingAddressInfo } from '@/entities/order';
import { requestTossCardPayment } from '@/entities/payment';
import { useCreateOrderMutation } from '@/features/order/manage';
import { useCartStore } from '@/shared/store/cartStore';

export function useCheckout() {
  const { carts, subtotal, tax, shippingFee, total } = useCartStore();
  const createOrder = useCreateOrderMutation();

  const [shippingInfo, setShippingInfo] = useState<OrderShippingAddressInfo>({
    receiver: '',
    address: '',
    zipCode: '',
    phone: '',
    message: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
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
          const successUrl = process.env.NEXT_PUBLIC_TOSS_SUCCESS ?? '';
          const failUrl = process.env.NEXT_PUBLIC_TOSS_FAIL ?? '';

          await requestTossCardPayment({
            amount: total,
            orderId: newOrderId,
            orderName:
              carts.length > 1 ? `${carts[0].pname} 외 ${carts.length - 1}개` : `${carts[0].pname}`,
            customerName: '판매자_테스트',
            successUrl,
            failUrl,
          });
        } catch (error: unknown) {
          toast.error('Toss 결제 요청 실패 또는 취소');
          const msg =
            error instanceof Error ? error.message : typeof error === 'string' ? error : '';
          console.warn('Toss 결제 요청 실패 또는 취소:', msg);
        }
      },
    });
  };

  return {
    carts,
    subtotal,
    tax,
    shippingFee,
    total,
    shippingInfo,
    isPending: createOrder.isPending,
    handleInputChange,
    handleSubmit,
  };
}
