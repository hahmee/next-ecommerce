"use client";

import React, {useState} from "react";
import {SalesStatus, SalesStatusKor} from "@/types/salesStatus";
import {CartItemList} from "@/interface/CartItemList";
import {useCartStore} from "@/store/cartStore";
import {CartItem} from "@/interface/CartItem";
import {ColorTag} from "@/interface/ColorTag";
import {getCookie} from "cookies-next";
import toast from "react-hot-toast";
import GACta from "@/libs/ga-call-to-action/GACta";
import {GA_CTA_EVENTS} from "@/constants";

const AddCart = ({
                     pno,
                     salesStatus,
                     options,
                     sellerEmail
                 }: {
    pno: number;
    salesStatus: SalesStatus;
    options: { color: ColorTag, size: string; },
    sellerEmail: string;
}) => {

    const [quantity, setQuantity] = useState(1);
    const {carts, changeCart, isLoading, changeOpen} = useCartStore();
    const memberInfo = getCookie('member');
    const member = memberInfo ? JSON.parse(memberInfo) : null;

    const handleQuantity = (type: "i" | "d") => {
        if (type === "d") {
            setQuantity((prev) => prev - 1);
        }
        if (type === "i") {
            setQuantity((prev) => prev + 1);
        }
    };

    const handleClickAddCart = async () => {

        changeOpen(true);

        //같은 사이즈, 같은 컬러가 이미 담겨져있는지 확인한다.
        const result = carts.filter((item: CartItemList) => item.size === options.size && item.color.id === options.color.id);
        try {
            //해당하는 cino 의 개수를 바꿔야함
            if (result && result.length > 0) { // 담겨있었음
                const cartItemChange: CartItem = {
                    email: member.email, //사용자 이메일
                    pno: pno,
                    qty: result[0].qty + quantity,
                    color: options.color,
                    size: options.size,
                    sellerEmail: sellerEmail, //판매자 이메일
                };

                await changeCart(cartItemChange); // 수량만 추가
            } else { //아무것도 안담겨있었음
                const cartItem: CartItem = {
                    email: member.email,
                    pno: pno,
                    qty: quantity,
                    color: options.color,
                    size: options.size,
                    sellerEmail: sellerEmail,
                };

                await changeCart(cartItem); //새로 담기
            }

            toast.success('장바구니에 담겼습니다.');
        } catch (error) {
            toast.error(`장바구니 담기 실패: ${(error as Error).message}`);
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
                <GACta
                  eventName="add_to_cart"
                  eventParams={{
                      //todo: 실제 데이터 넣기
                      currency: "KRW",
                      value: 39000,
                      items: [
                          {
                              item_id: "sku_123",
                              item_name: "블루투스 스피커",
                              price: 39000,
                              quantity: 1,
                          },
                      ],
                  }}
                >
                <button
                    onClick={handleClickAddCart}
                    disabled={isLoading || salesStatus != SalesStatus.ONSALE}
                    className="w-36 text-sm rounded-3xl ring-1 ring-ecom text-ecom py-2 px-4 hover:bg-ecom hover:text-white disabled:cursor-not-allowed disabled:bg-pink-200 disabled:ring-0 disabled:text-white disabled:ring-none"
                >
                    Add to Cart
                </button>
                </GACta>
            </div>
        </div>
    );
};

export default AddCart;
