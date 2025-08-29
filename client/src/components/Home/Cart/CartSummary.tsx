'use client';

import React from 'react';
import { useCartStore } from '@/store/cartStore';
import Image from 'next/image';
import Link from 'next/link';

const CartSummary = ({
  type,
  cartButtonClick,
}: {
  type: 'Checkout' | 'Payment';
  cartButtonClick?: () => void;
}) => {
  const { carts, isLoading, subtotal, shippingFee, tax, total } = useCartStore();

  return (
    <div className="w-full lg:w-1/3 bg-white p-6 shadow-sm rounded-lg">
      <div className="flex justify-between">
        <h2 className="text-lg font-medium mb-4">Order Summary({carts.length})</h2>
        {type === 'Payment' && (
          <Link href="/cart" className="cursor-pointer">
            <h2 className="text-base font-medium mb-4 underline">Edit Cart</h2>
          </Link>
        )}
      </div>

      {type === 'Payment' && (
        <div className="flex flex-col gap-5 py-2 border-t border-b pt-4 pb-4">
          {carts.map((item) => (
            <div className="flex justify-between" key={item.cino}>
              <div className="flex gap-2">
                <Image
                  src={item.imageFile}
                  alt="Product Image"
                  width={500}
                  height={500}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex flex-col text-sm text-gray-800">
                  <span className="font-semibold">{item.pname}</span>
                  <span className="">Color: {item.color.text}</span>
                  <span className="">Size: {item.size}</span>
                  <span className="">Qty: {item.qty}</span>
                </div>
              </div>
              <div>{item.price.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-between py-2">
        <span>Subtotal</span>
        <span>{subtotal.toLocaleString()}</span>
      </div>
      <div className="flex justify-between py-2">
        <span>Shipping estimate</span>
        <span>{shippingFee.toLocaleString()}</span>
      </div>
      <div className="flex justify-between py-2">
        <span>Tax</span>
        <span>{tax.toLocaleString()}</span>
      </div>
      <div className="flex justify-between py-2 font-semibold border-t pt-4">
        <span>Order total</span>
        <span>{total.toLocaleString()}</span>
      </div>

      <button
        className="w-full text-sm rounded-3xl ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
        onClick={cartButtonClick}
        name="payment"
        aria-label={type}
      >
        {type}
      </button>
      <div className="text-sm text-gray-400 text-center mt-4">
        <span className="underline">Free shipping</span> on orders over{' '}
        <span className="underline">100,000 KRW</span>
      </div>
    </div>
  );
};
export default CartSummary;
