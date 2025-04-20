"use client";
import React, {useCallback} from "react";
import {CartItemList} from "@/interface/CartItemList";
import Image from "next/image";
import {MinusIcon, PlusIcon,} from "@heroicons/react/20/solid";
import {TrashIcon} from "@heroicons/react/24/outline";
import Link from "next/link";
import {useCartStore} from "@/store/cartStore";
import {ColorTag} from "@/interface/ColorTag";
import {CartItem} from "@/interface/CartItem";
import {getCookie} from "cookies-next";
import toast from "react-hot-toast";

const SingleCartItem = ({cartItem}:{ cartItem: CartItemList }) => {

    const memberInfo = getCookie('member');
    const member = memberInfo ? JSON.parse(memberInfo) : null;

    const { carts, changeCart, removeItem } = useCartStore();

    // 수량이 변경될 때마다 장바구니 변경을 처리
    const handleQuantity = useCallback(async (type: "i" | "d") => {
       await handleClickAddCart(cartItem.pno, {color: cartItem.color, size: cartItem.size}, type === "i" ? cartItem.qty +1 : cartItem.qty -1);
    }, [carts]);

    const handleClickAddCart = useCallback(async (pno: number, options: { color: ColorTag; size: string }, newQuantity: number) => {
            const result = carts.filter((item: CartItemList) => item.size === options.size && item.color.id === options.color.id);
            const cartItemChange: CartItem = {
                email: member.email,
                pno: pno,
                qty: result.length > 0 ? newQuantity : 1,
                color: options.color,
                size: options.size,
                sellerEmail: cartItem.sellerEmail,
            };

            try {
                await changeCart(cartItemChange);
            } catch (e) {
                toast.error("장바구니 변경 실패");
            }
        },
        [carts, changeCart]
    );

    const handleRemove = async () => {
        try {
            await removeItem(cartItem.cino);
            toast.success("장바구니에서 제거했습니다.");
        } catch (e) {
            toast.error(`제거 실패: ${(e as Error).message}`);
        }
    };

    return (
        <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div className="flex items-center space-x-4">
                <Link href={`/product/${cartItem.pno}`}>
                    <Image
                        src={cartItem.imageFile}
                        alt="Product Image"
                        width={500}
                        height={500}
                        className="w-24 h-24 object-cover rounded-lg"
                    />
                </Link>
                <div>
                    <h2 className="text-lg font-medium">{cartItem.pname}</h2>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                        <span className="flex items-center">
                            <span>Color: {cartItem.color.text}</span>
                        </span>
                        <span>|</span>
                        <span className="flex items-center">
                            <span>Size: {cartItem.size}</span>
                        </span>
                    </div>
                    <div className="text-green-500 text-sm mt-2">In Stock</div>
                </div>
            </div>
            <div className="flex items-center space-x-8">

                <div className="flex items-center">
                    <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-200"
                            onClick={() => handleQuantity("d")} disabled={cartItem.qty === 1}
                            aria-label="Decrease Quantity">
                        <MinusIcon className="w-4 h-4 text-gray-600"/>
                    </button>
                    <span className="px-4 py-2">{cartItem.qty.toLocaleString()}</span>
                    <button className="p-2 rounded-full border border-gray-300 hover:bg-gray-200"
                            onClick={() => handleQuantity("i")} aria-label="Increase Quantity">
                        <PlusIcon className="w-4 h-4 text-gray-600"/>
                    </button>
                </div>

                <div>
                    <p className="text-lg font-semibold text-green-600">{(cartItem.price).toLocaleString()} 원</p>
                </div>
                <button className="text-red-500 hover:text-red-700 flex items-center"
                        onClick={handleRemove} aria-label="Remove Item">
                    <TrashIcon className="w-5 h-5 mr-1"/>
                </button>
            </div>
        </div>
    );
}
export default SingleCartItem;