import Image from 'next/image';
import { FC } from 'react';

import { CartItemList } from '@/entities/cart';
import { useDeleteCartMutation } from '@/features/product/cart/model/useDeleteCartMutation';
import { useCartStore } from '@/shared/store/cartStore';

interface Props {
  item: CartItemList;
}

export const CartItem: FC<Props> = ({ item }) => {
  const { isLoading } = useCartStore();
  const { mutate: deleteCartItem } = useDeleteCartMutation();

  const handleRemove = async () => {
    if (isLoading) return;
    deleteCartItem(item.cino);
  };

  return (
    <div className="flex gap-4" key={item.cino}>
      {item.imageFile && (
        <Image
          src={item.imageFile}
          alt="이미지"
          width={72}
          height={96}
          className="object-cover rounded-md"
        />
      )}
      <div className="flex flex-col justify-between w-full">
        {/* TOP */}
        <div className="">
          {/* TITLE */}
          <div className="flex items-center justify-between gap-8">
            <h3 className="font-semibold">{item.pname}</h3>
            <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
              {item.qty && item.qty > 1 && (
                <div className="text-xs text-green-500">{item.qty} x </div>
              )}
              {item.price.toLocaleString()}원
            </div>
          </div>
          {/* DESC */}
          <div className="text-sm text-gray-500">
            {item.color.text} | {item.size}
          </div>
        </div>
        {/* BOTTOM */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Qty. {item.qty}</span>
          <span
            className="text-blue-500"
            style={{ cursor: isLoading ? 'not-allowed' : 'pointer' }}
            onClick={handleRemove}
          >
            Remove
          </span>
        </div>
      </div>
    </div>
  );
};
