'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

import { CartItemCard } from '@/entities/cart';
import { GA_CTA_EVENTS } from '@/shared/config';
import GACta from '@/shared/ga/GACta';
import { useCartStore } from '@/shared/store/cartStore';

export const CartModal = () => {
  const { carts, isLoading, open, subtotal, changeOpen } = useCartStore();
  const router = useRouter();

  const handleMove = (path: string) => {
    router.push(path);
  };

  if (!open) {
    return null;
  }

  return (
    <>
      {/* 모달 바깥 클릭 */}
      <div
        className={`z-10 fixed w-full overflow-hidden h-screen top-0 left-0 ${!open && 'hidden'}`}
        onClick={() => changeOpen(false)}
      />

      <div className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20 animate-fadeInUp max-h-[80vh] overflow-y-auto">
        {carts && carts.length < 1 ? (
          <div className="">Cart is Empty</div>
        ) : (
          <>
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            {/* LIST */}
            <div className="flex flex-col gap-8">
              {/* ITEM */}
              {carts.map((item) => (
                <CartItemCard key={item.cino} item={item} />
              ))}
            </div>
            {/* BOTTOM */}
            <div className="">
              <div className="flex items-center justify-between font-semibold">
                <span className="">Subtotal</span>
                <span className="">{subtotal.toLocaleString()}원</span>
              </div>
              <p className="text-gray-500 text-sm mt-2 mb-4">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="flex justify-between text-sm">
                <GACta eventName={GA_CTA_EVENTS.onClickCartCTA}>
                  <button
                    className="rounded-md py-3 px-4 ring-1 ring-gray-300"
                    onClick={() => handleMove('/cart')}
                  >
                    View Cart
                  </button>
                </GACta>
                <GACta eventName="begin_checkout">
                  <button
                    className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
                    disabled={isLoading}
                    onClick={() => handleMove('/checkout')}
                  >
                    Checkout
                  </button>
                </GACta>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
