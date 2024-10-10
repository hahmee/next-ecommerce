"use client";
import React from "react";
import {useCartStore} from "@/store/cartStore";

const CartSummary = ({message, cartButtonClick}: { message: string, cartButtonClick: (e?:any) => void }) => {

    const {cart, isLoading , subtotal} = useCartStore();

    // const subtotal = useMemo(() => {
    //     let total = 0;
    //
    //     for (const item of cart) {
    //         total += item.qty * item.price;
    //     }
    //
    //     return total;
    // }, [cart]);

    return (
        <div className="w-full lg:w-1/4 bg-white p-6 shadow-sm rounded-lg">
            <h2 className="text-lg font-medium mb-4">Order Summary</h2>
            <div className="flex justify-between py-2">
                <span>Subtotal</span>
                <span>{subtotal}</span>
            </div>
            <div className="flex justify-between py-2">
                <span>Shipping estimate</span>
                <span>0</span>
            </div>
            <div className="flex justify-between py-2 font-semibold border-t pt-4">
                <span>Order total</span>
                <span>{subtotal}</span>
            </div>

            <button
                className="w-full text-sm rounded-3xl ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
                onClick={cartButtonClick}>
                {message}
            </button>
            <div className="text-sm text-gray-400 text-center mt-4">
                Learn more <a href="#" className="underline">Taxes</a> and <a href="#" className="underline">Shipping</a> information.
            </div>
        </div>

    );

};
export default CartSummary;