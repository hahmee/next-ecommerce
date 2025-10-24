'use client';

import React from 'react';

import { useCheckout } from '@/features/checkout';
import { CheckoutView } from '@/features/checkout';

export function Checkout() {
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
