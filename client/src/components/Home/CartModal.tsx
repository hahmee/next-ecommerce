"use client";

import Image from "next/image";
import {useCartStore} from "@/store/cartStore";
import {useMemo, useState} from "react";
import CartItem from "@/components/Home/CartItem";


const  CartModal = () => {

    const { cart, isLoading, removeItem } = useCartStore();

    console.log('cart..........', cart);

    const subtotal = useMemo(() => {
        let total = 0;

        for (const item of cart) {
            total += item.qty * item.price;
        }

        return total;
    }, [cart]);


    const handleCheckout = async () => {
        try {


        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div
            className="w-max absolute p-4 rounded-md shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-white top-12 right-0 flex flex-col gap-6 z-20">
            {cart && cart.length < 1 ? (
                <div className="">Cart is Empty</div>
            ) : (
                <>
                    <h2 className="text-xl">Shopping Cart</h2>
                    {/* LIST */}
                    <div className="flex flex-col gap-8">
                        {/* ITEM */}
                        {
                            cart.map((item) => (
                                <CartItem key={item.cino} item={item}/>
                            ))
                        }
                    </div>
                    {/* BOTTOM */}
                    <div className="">
                        <div className="flex items-center justify-between font-semibold">
                            <span className="">Subtotal</span>
                            <span className="">{subtotal}</span>
                        </div>
                        <p className="text-gray-500 text-sm mt-2 mb-4">
                            Shipping and taxes calculated at checkout.
                        </p>
                        <div className="flex justify-between text-sm">
                            <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                                View Cart
                            </button>
                            <button
                                className="rounded-md py-3 px-4 bg-black text-white disabled:cursor-not-allowed disabled:opacity-75"
                                disabled={isLoading}
                                onClick={handleCheckout}
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default CartModal;
