// src/entities/cart/ui/Cart.tsx

'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import CartList from '@/entities/cart/ui/CartList';
import CartSummary from '@/entities/cart/ui/CartSummary';

const Cart = () => {
  const router = useRouter();

  const cartButtonClick = () => {
    router.push('/checkout');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Cart Header */}
      <div className="bg-white py-4">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-semibold">Shopping Cart</h1>
        </div>
      </div>

      {/* Cart Items Section */}
      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="w-full lg:w-2/3 bg-white p-6 shadow-sm rounded-lg">
          <CartList />
        </div>
        {/* Cart Summary */}
        <CartSummary type="Checkout" cartButtonClick={cartButtonClick} />
      </div>
    </div>
  );
};
export default Cart;
