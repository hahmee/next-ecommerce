import React from 'react';
// import { MinusIcon, PlusIcon, TrashIcon } from '@heroicons/react/solid'; // Icons for +/- buttons

const CartPage = () => {

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
                    {/* Single Cart Item */}
                    <div className="flex items-center justify-between border-b pb-4 mb-4">
                        <div className="flex items-center space-x-4">
                            <img
                                src="/images/sample-product.jpg" // replace with actual image source
                                alt="Product Image"
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div>
                                <h2 className="text-lg font-medium">Rey Nylon Backpack</h2>
                                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <span className="flex items-center">
                    <span>Color: Black</span>
                  </span>
                                    <span>|</span>
                                    <span className="flex items-center">
                    <span>Size: 2XL</span>
                  </span>
                                </div>
                                <div className="text-green-500 text-sm mt-2">In Stock</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button className="p-2 hover:bg-gray-200">
                                    {/*<MinusIcon className="w-4 h-4 text-gray-600" />*/}
                                </button>
                                <span className="px-4 py-2">1</span>
                                <button className="p-2 hover:bg-gray-200">
                                    {/*<PlusIcon className="w-4 h-4 text-gray-600" />*/}
                                </button>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-green-600">$74.00</p>
                            </div>
                            <button className="text-red-500 hover:text-red-700 flex items-center">
                                {/*<TrashIcon className="w-5 h-5 mr-1" />*/}
                                Remove
                            </button>
                        </div>
                    </div>

                    {/* Another Cart Item */}
                    <div className="flex items-center justify-between border-b pb-4 mb-4">
                        <div className="flex items-center space-x-4">
                            <img
                                src="/images/sample-product.jpg" // replace with actual image source
                                alt="Product Image"
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                            <div>
                                <h2 className="text-lg font-medium">Round Buckle 1 Belt</h2>
                                <div className="flex items-center text-sm text-gray-500 space-x-2">
                  <span className="flex items-center">
                    <span>Color: Black</span>
                  </span>
                                    <span>|</span>
                                    <span className="flex items-center">
                    <span>Size: 2XL</span>
                  </span>
                                </div>
                                <div className="text-red-500 text-sm mt-2">Sold Out</div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-8">
                            <div className="flex items-center border border-gray-300 rounded-md">
                                <button className="p-2 hover:bg-gray-200">
                                    {/*<MinusIcon className="w-4 h-4 text-gray-600"/>*/}
                                </button>
                                <span className="px-4 py-2">1</span>
                                <button className="p-2 hover:bg-gray-200">
                                    {/*<PlusIcon className="w-4 h-4 text-gray-600"/>*/}
                                </button>
                            </div>
                            <div>
                                <p className="text-lg font-semibold text-green-600">$68.00</p>
                            </div>
                            <button className="text-red-500 hover:text-red-700 flex items-center">
                                {/*<TrashIcon className="w-5 h-5 mr-1"/>*/}
                                Remove
                            </button>
                        </div>
                    </div>
                </div>

                {/* Cart Summary */}
                <div className="w-full lg:w-1/4 bg-white p-6 shadow-sm rounded-lg">
                    <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                    <div className="flex justify-between py-2">
                        <span>Subtotal</span>
                        <span>$142.00</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span>Shipping estimate</span>
                        <span>$5.00</span>
                    </div>
                    <div className="flex justify-between py-2">
                        <span>Tax estimate</span>
                        <span>$24.90</span>
                    </div>
                    <div className="flex justify-between py-2 font-semibold border-t pt-4">
                        <span>Order total</span>
                        <span>$276.00</span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-md mt-6 hover:bg-blue-700">
                        Checkout
                    </button>
                    <div className="text-sm text-gray-400 text-center mt-4">
                        Learn more <a href="#" className="underline">Taxes</a> and <a href="#"
                                                                                      className="underline">Shipping</a> information.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage;
