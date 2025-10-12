'use client';

import React from 'react';

import { useCheckout } from '@/hooks/home/checkout/useCheckout';

import CheckoutView from './CheckoutView';

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
