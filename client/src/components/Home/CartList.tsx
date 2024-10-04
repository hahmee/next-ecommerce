"use client";
import {useCartStore} from "@/store/cartStore";
import SingleCartItem from "@/components/Home/SingleCartItem";

const CartList = () => {
    const { cart } = useCartStore();

    if(cart.length === 0) {
        return <div className="flex items-center justify-center h-full">Cart is Empty</div>;
    }
    return (
        cart.map((cartItem) => (
            <SingleCartItem cartItem={cartItem} key={cartItem.cino}/>
        ))
    )
}
export default CartList;