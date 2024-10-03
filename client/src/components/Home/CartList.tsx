"use client";
import {useCartStore} from "@/store/cartStore";
import SingleCartItem from "@/components/Home/SingleCartItem";

const CartList = () => {
    const { cart, counter, getCart, changeOpen, open } = useCartStore();

    return (
        cart.map((cartItem) => (
            <SingleCartItem cartItem={cartItem} key={cartItem.pno}/>
        ))
    )
}
export default CartList;