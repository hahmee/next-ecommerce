// src/entities/cart/ui/CartList.tsx



'use client';

import SingleCartItem from '@/entities/cart/ui/SingleCartItem';
import { useCartStore } from '@/shared/store/cartStore';

const CartList = () => {
  const { carts } = useCartStore();

  if (carts.length === 0) {
    return <div className="flex items-center justify-center h-full">Cart is Empty</div>;
  }

  return carts.map((cartItem) => <SingleCartItem cartItem={cartItem} key={cartItem.cino} />);
};
export default CartList;
