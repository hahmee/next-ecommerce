// src/features/product/cart/ui/AddCart.tsx

﻿// src/features/product/cart/ui/AddCart.tsx



'use client';

import React, { useState } from 'react';

import { CartItem } from '@/entities/cart/model/CartItem';
import { SalesStatus, SalesStatusKor } from '@/entities/product/consts/SalesStatus';
import { useChangeCartMutation } from '@/features/product/cart/model/useChangeCartMutation';
import GACta from '@/shared/ga/GACta';
import { ColorTag } from '@/shared/model/ColorTag';
import { useCartStore } from '@/shared/store/cartStore';
import { useUserStore } from '@/shared/store/userStore';

const AddCart = ({
  pno,
  salesStatus,
  options,
  sellerEmail,
}: {
  pno: number;
  salesStatus: SalesStatus;
  options: { color: ColorTag; size: string };
  sellerEmail: string;
}) => {
  const [quantity, setQuantity] = useState(1);
  const { carts, isLoading, changeOpen } = useCartStore();
  const { user } = useUserStore();
  const { mutate: changeCart } = useChangeCartMutation();

  const handleQuantity = (type: 'i' | 'd') => {
    if (type === 'd') {
      setQuantity((prev) => prev - 1);
    }
    if (type === 'i') {
      setQuantity((prev) => prev + 1);
    }
  };

  const handleClickAddCart = async () => {
    changeOpen(true);

    // 같은 사이즈, 같은 컬러가 이미 담겨져있는지 확인한다.
    const existing = carts.find(
      (item) => item.size === options.size && item.color.id === options.color.id,
    );

    const cartItem: CartItem = {
      email: user?.email || '',
      pno,
      qty: existing ? existing.qty + quantity : quantity,
      color: options.color,
      size: options.size,
      sellerEmail,
    };

    changeCart(cartItem); // React Query 내부에서 fetcher 실행 + 상태 갱신
  };

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-medium">Choose a Quantity</h4>
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity('d')}
              disabled={quantity === 1}
            >
              -
            </button>
            {quantity}
            <button
              className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
              onClick={() => handleQuantity('i')}
              // disabled={quantity===stockNumber}
              disabled={salesStatus != SalesStatus.ONSALE}
            >
              +
            </button>
          </div>
          <div className="text-xs">{SalesStatusKor[salesStatus]}</div>
        </div>
        <GACta
          eventName="add_to_cart"
          eventParams={{
            // todo: 실제 데이터 넣기
            currency: 'KRW',
            value: 39000,
            items: [
              {
                item_id: 'sku_123',
                item_name: '블루투스 스피커',
                price: 39000,
                quantity: 1,
              },
            ],
          }}
        >
          <button
            onClick={handleClickAddCart}
            disabled={!user || isLoading || salesStatus != SalesStatus.ONSALE}
            className="w-36 text-sm rounded-3xl ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
          >
            Add to Cart
          </button>
        </GACta>
      </div>
    </div>
  );
};

export default AddCart;
