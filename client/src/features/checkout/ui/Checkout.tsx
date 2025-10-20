// src/features/checkout/ui/Checkout.tsx

'use client';

import React from 'react';

import { useCheckout } from '@/features/checkout/model/useCheckout';
import CheckoutView from '@/features/checkout/ui/CheckoutView';

export default function Checkout() {
  const { shippingInfo, handleInputChange, handleSubmit, isPending } = useCheckout();

  return (
    <CheckoutView
      shippingInfo={shippingInfo}
      onChange={handleInputChange}
      onSubmit={handleSubmit}
      disabled={isPending}
    />
  );
}
