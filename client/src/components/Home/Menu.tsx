'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import SearchBar from '@/components/Home/SearchBar';
import { usePathname } from 'next/navigation';
import GuestAuthButtons from '@/components/Home/GuestAuthButtons';
import { useUserStore } from '@/store/userStore';
import {useLogout} from "@/hooks/useLogout";


const Menu = () => {
  const pathname = usePathname();
  const { user } = useUserStore();
  const { logout, isPending } = useLogout();

  const [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false); // 경로 바뀌면 메뉴 닫기
  }, [pathname]);

  if (!user) {
    return <GuestAuthButtons />;
  }

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
        <div
          className="absolute bg-black left-0 top-20 w-full h-[calc(100vh-80px)] text-xl z-10"
          role="dialog"
          aria-modal="true"
          aria-label="메뉴"
        >
          <div className="my-18 mx-5">
            <SearchBar />
          </div>

          <nav className="text-white flex flex-col items-center justify-center gap-8">
            <Link href="/list">쇼핑 페이지</Link>
            <Link href="/shopping">나의 쇼핑</Link>
            <Link href="/review">나의 리뷰</Link>
            <Link href="/cart">장바구니</Link>

            {isAdmin(user) && <Link href="/admin/products">어드민</Link>}

            <button
              type="button"
              onClick={() => logout()}
              disabled={isPending}
              className="cursor-pointer disabled:opacity-60"
            >
              {isPending ? '로그아웃 중…' : '로그아웃'}
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default Menu;
