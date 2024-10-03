import React from 'react';
import CartSummary from "@/components/Home/CartSummary";
import CartList from "@/components/Home/CartList";

export default function CartPage() {

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Cart Header */}
            <div className="bg-white py-4">
                <div className="container mx-auto px-4">
                    <h1 className="text-3xl font-semibold">Shopping Cart</h1>
                </div>
            </div>

            {/* Cart Items Section */}
            <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
                {/* Cart Items */}
                <div className="w-full lg:w-3/4 bg-white p-6 shadow-sm rounded-lg">
                    <CartList/>
                </div>
                {/* Cart Summary */}
                <CartSummary/>
            </div>
        </div>
    );
};

