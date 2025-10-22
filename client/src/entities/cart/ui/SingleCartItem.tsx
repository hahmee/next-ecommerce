// src/entities/cart/ui/SingleCartItem.tsx


'use client';

import { MinusIcon, PlusIcon } from '@heroicons/react/20/solid';
import { TrashIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';
import React, { useCallback } from 'react';

import { CartItem } from '@/entities/cart/model/CartItem';
import { CartItemList } from '@/entities/cart/model/CartItemList';
import { useChangeCartMutation } from '@/features/product/cart/model/useChangeCartMutation';
import { useDeleteCartMutation } from '@/features/product/cart/model/useDeleteCartMutation';
import { ColorTag } from '@/shared/model/ColorTag';
import { useCartStore } from '@/shared/store/cartStore';
import { useUserStore } from '@/shared/store/userStore';

const SingleCartItem = ({ cartItem }: { cartItem: CartItemList }) => {
  const { user } = useUserStore();
  const { carts, changeOpen, isLoading } = useCartStore();
  const { mutate: changeCart } = useChangeCartMutation();
  const { mutate: deleteCartItem } = useDeleteCartMutation();

  // 수량이 변경될 때마다 장바구니 변경을 처리
  const handleQuantity = useCallback(
    async (type: 'i' | 'd') => {
      await handleClickAddCart(
        cartItem.pno,
        { color: cartItem.color, size: cartItem.size },
        type === 'i' ? cartItem.qty + 1 : cartItem.qty - 1,
      );
    },
    [carts],
  );

  const handleClickAddCart = useCallback(
    async (pno: number, options: { color: ColorTag; size: string }, newQuantity: number) => {
      const item: CartItem = {
        email: user?.email || '',
        pno,
        qty: newQuantity,
        color: options.color,
        size: options.size,
        sellerEmail: cartItem.sellerEmail,
      };

      changeCart(item); // React Query 내부에서 fetcher 실행 + 상태 갱신
    },
    [changeCart],
  );

  const handleRemove = async () => {
    deleteCartItem(cartItem.cino);
  };

  return (
    <div className="flex items-center justify-between border-b pb-4 mb-4">
      <div className="flex items-center space-x-4">
        <Link href={`/product/${cartItem.pno}`}>
          <Image
            src={cartItem.imageFile}
            alt="Product Image"
            width={500}
            height={500}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </Link>
        <div>
          <h2 className="text-lg font-medium">{cartItem.pname}</h2>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span className="flex items-center">
              <span>Color: {cartItem.color.text}</span>
            </span>
            <span>|</span>
            <span className="flex items-center">
              <span>Size: {cartItem.size}</span>
            </span>
          </div>
          <div className="text-green-500 text-sm mt-2">In Stock</div>
        </div>
      </div>
      <div className="flex items-center space-x-8">
        <div className="flex items-center">
          <button
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-200"
            onClick={() => handleQuantity('d')}
            disabled={cartItem.qty === 1}
            aria-label="Decrease Quantity"
          >
            <MinusIcon className="w-4 h-4 text-gray-600" />
          </button>
          <span className="px-4 py-2">{cartItem.qty.toLocaleString()}</span>
          <button
            className="p-2 rounded-full border border-gray-300 hover:bg-gray-200"
            onClick={() => handleQuantity('i')}
            aria-label="Increase Quantity"
          >
            <PlusIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <div>
          <p className="text-lg font-semibold text-green-600">
            {cartItem.price.toLocaleString()} 원
          </p>
        </div>
        <button
          className="text-red-500 hover:text-red-700 flex items-center"
          onClick={handleRemove}
          aria-label="Remove Item"
        >
          <TrashIcon className="w-5 h-5 mr-1" />
        </button>
      </div>
    </div>
  );
};
export default SingleCartItem;
