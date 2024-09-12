"use client";


import {useState} from "react";
import {SalesStatus, SalesStatusKor} from "@/types/salesStatus";
import {CartItemList} from "@/interface/CartItemList";
import {useCartStore} from "@/store/cartStore";
import {CartItem} from "@/interface/CartItem";
import {cookies} from "next/headers";

const Add = ({
                 pno,
                 variantId,
                 salesStatus,
             }: {
    pno: number;
    variantId: string;
    salesStatus: SalesStatus;
}) => {
    const [quantity, setQuantity] = useState(1);
    const { cart, changeCart, isLoading } = useCartStore();

    // // TEMPORARY
    // const stock = 4;

    const handleQuantity = (type: "i" | "d") => {
        if (type === "d" ) {
            setQuantity((prev) => prev - 1);
        }
        if (type === "i") {
            setQuantity((prev) => prev + 1);
        }
    };

    const handleClickAddCart = () => {
        const result = cart.filter((item: CartItemList) => item.pno === pno);

        console.log('result', result);

        if (result && result.length > 0) {
            const cartItemChange: CartItem = {
                email: "use1@aaa.com",//loginState.email,
                pno: pno,
                qty: result[0].qty + 1,
            };
            changeCart(cartItemChange); // 수량만 추가
        } else {
            const cartItem: CartItem = {
                email: "use1@aaa.com", // loginState.email,
                pno: pno,
                qty: 1,
            };
            changeCart(cartItem);
        }
    };


    return (
        <div className="flex flex-col gap-4">
            <h4 className="font-medium">Choose a Quantity</h4>
            <div className="flex justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
                        <button
                            className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
                            onClick={() => handleQuantity("d")}
                            disabled={quantity === 1}
                        >
                            -
                        </button>
                        {quantity}
                        <button
                            className="cursor-pointer text-xl disabled:cursor-not-allowed disabled:opacity-20"
                            onClick={() => handleQuantity("i")}
                            // disabled={quantity===stockNumber}
                            disabled={salesStatus != SalesStatus.ONSALE}
                        >
                            +
                        </button>
                    </div>

                    <div className="text-xs">{SalesStatusKor[salesStatus]}</div>


                </div>
                <button
                    // onClick={() => addItem(wixClient, productId, variantId, quantity)}
                    // onClick={() => changeCart()}
                    onClick={handleClickAddCart}

                    // disabled={isLoading}
                    className="w-36 text-sm rounded-3xl ring-1 ring-lama text-lama py-2 px-4 hover:bg-lama hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default Add;
