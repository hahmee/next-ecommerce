"use client";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {logout} from "@/app/(home)/profile/_lib/getUserServer";
import {useQueryClient} from "@tanstack/react-query";
import {Member} from "@/interface/Member";
import CartModal from "@/components/Home/CartModal";
import {useCartStore} from "@/store/cartStore";

const NavIcons = ({memberInfo}: {memberInfo: Member}) => { // 변경하기
    const queryClient = useQueryClient();
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { cart, counter, getCart } = useCartStore();

    const onLogout = async () => {

        // `posts`로 시작하는 키로 모든 쿼리를 무효화함
        // queryClient.invalidateQueries({
        //     queryKey: ["posts"],
        // });
        // queryClient.invalidateQueries({
        //     queryKey: ["users"],
        // });

        await logout();
    };

    useEffect(() => {
        getCart();

    }, []);


    return (
        <div className="flex items-center gap-4 xl:gap-6 relative">
            <Image
                src="/profile.png"
                alt=""
                width={22}
                height={22}
                className="cursor-pointer"
            />

            <div
                className="absolute p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20">
                <Link href="/profile">Profile</Link>
                <div className="mt-2 cursor-pointer">
                    <button onClick={onLogout}>로그아웃</button>
                </div>
                <div className="mt-2 cursor-pointer">
                    <Link href="/admin">어드민</Link>
                </div>
            </div>

            <Image
                src="/notification.png"
                alt=""
                width={22}
                height={22}
                className="cursor-pointer"
            />
            <div
                className="relative cursor-pointer"
                onClick={() => setIsCartOpen((prev) => !prev)}
            >
                <Image src="/cart.png" alt="" width={22} height={22}/>
                <div
                    className="absolute -top-4 -right-4 w-6 h-6 bg-lama rounded-full text-white text-sm flex items-center justify-center">
                    {counter}
                </div>
            </div>
            {isCartOpen && <CartModal />}
        </div>
    );
};

export default NavIcons;
