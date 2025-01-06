"use client";

import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import SearchBar from "@/components/Home/SearchBar";
import {usePathname, useRouter} from "next/navigation";
import {logout} from "@/apis/mallAPI";
import toast from "react-hot-toast";
import {MemberRole} from "@/types/memberRole";
import {Member} from "@/interface/Member";

const Menu = ({memberInfo}: {memberInfo: Member}) => {
    const [open, setOpen] = useState(false);
    const pathname = usePathname(); // 현재 경로 가져오기
    const router = useRouter();

    const onLogout = async () => {

        // queryClient.invalidateQueries({
        //     queryKey: ["users"],
        // });

        await logout();

        router.push('/login');
        toast.success("로그아웃 되었습니다.");
    };


    useEffect(() => {
        setOpen(false);

    }, [pathname]);

    return (
        <div className="">
            <Image
                src="/images/mall/menu.png"
                alt="menu"
                width={28}
                height={28}
                className="cursor-pointer"
                onClick={() => setOpen((prev) => !prev)}
            />
            {open && (
                <div className="absolute bg-black left-0 top-20 w-full h-[calc(100vh-80px)] text-xl z-10">
                    <div className="my-18 mx-5">
                        <SearchBar/>
                    </div>
                    <div className="text-white flex flex-col items-center justify-center gap-8">
                        <Link href="/list">쇼핑 페이지</Link>
                        <Link href="/shopping">나의 쇼핑</Link>
                        <Link href="/review">나의 리뷰</Link>
                        <Link href="/cart">장바구니</Link>
                        {memberInfo.roleNames.some(role => [MemberRole.ADMIN, MemberRole.MANAGER].includes(role)) && (
                            <Link href="/admin/products">
                                어드민
                            </Link>
                        )}
                        <span onClick={onLogout} className="cursor-pointer">로그아웃</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Menu;
