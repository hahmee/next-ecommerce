"use client";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {Member} from "@/interface/Member";
import CartModal from "@/components/Home/CartModal";
import {useCartStore} from "@/store/cartStore";
import {logout} from "@/api/mallAPI";
import {useRouter} from "next/navigation";
import {BuildingStorefrontIcon} from "@heroicons/react/24/outline";
import {MemberRole} from "@/types/memberRole";

const NavIcons = ({memberInfo}: {memberInfo: Member}) => {
    const router = useRouter();
    const { cart, counter, getCart, changeOpen, open } = useCartStore();
    const [accountOpen, setAccountOpen] = useState(false);

    const onLogout = async () => {

        // `posts`로 시작하는 키로 모든 쿼리를 무효화함
        // queryClient.invalidateQueries({
        //     queryKey: ["posts"],
        // });
        // queryClient.invalidateQueries({
        //     queryKey: ["users"],
        // });

        await logout();

        router.push('/login');

    };


    useEffect(() => {
        console.log('getCart...................');
        getCart();

    }, []);


    return (
        <div className="flex items-center gap-4 xl:gap-6 relative">
            {/*모달 바깥 클릭 */}
            <div className={` z-10 fixed w-full overflow-hidden h-screen top-0 left-0 ${!accountOpen && "hidden"}`}
                 onClick={() => setAccountOpen(false)}></div>
            <Image
                src="/profile.png"
                alt="profile"
                width={22}
                height={22}
                className="cursor-pointer"
                onClick={() => setAccountOpen((prev) => !prev)}
            />
            {
                accountOpen && (
                    <div
                        className="absolute animate-fadeInUp p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20"
                        onClick={(e) => e.stopPropagation()}>
                        <div className="relative">
                            <Link href="/shopping">
                                <div className="cursor-pointer">
                                    나의쇼핑
                                </div>
                            </Link>
                            <Link href="/review">
                                <div className="mt-2 cursor-pointer">
                                    나의리뷰
                                </div>
                            </Link>
                            <div className="mt-2 cursor-pointer">
                                <button onClick={onLogout}>로그아웃</button>
                            </div>

                        </div>
                    </div>
                )
            }

            {memberInfo.roleNames.some(role => [MemberRole.ADMIN, MemberRole.MANAGER].includes(role)) && (
                <Link href="/admin/products">
                    <BuildingStorefrontIcon className="h-7 w-7 cursor-pointer" strokeWidth={1}/>
                </Link>
            )}

            <Image
                src="/notification.png"
                alt=""
                width={22}
                height={22}
                className="cursor-pointer"
            />
            <div
                className="relative cursor-pointer"
                onClick={() => changeOpen(!open)}
            >
                <Image src="/cart.png" alt="" width={22} height={22}/>
                <div
                    className="absolute -top-4 -right-4 w-6 h-6 bg-ecom rounded-full text-white text-sm flex items-center justify-center">
                    {counter}
                </div>
            </div>
            <CartModal/>
        </div>
    );
};

export default NavIcons;
