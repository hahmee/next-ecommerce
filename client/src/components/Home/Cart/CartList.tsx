'use client';

import { useCartStore } from '@/store/cartStore';
import SingleCartItem from '@/components/Home/Cart/SingleCartItem';

const CartList = () => {
  const { carts } = useCartStore();

  if (carts.length === 0) {
    return <div className="flex items-center justify-center h-full">Cart is Empty</div>;
  }

  return carts.map((cartItem) => <SingleCartItem cartItem={cartItem} key={cartItem.cino} />);
};
export default CartList;
