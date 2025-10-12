'use client';

import { BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';

import GuestAuthButtons from '@/widgets/layout/ui/GuestAuthButtons';

const CartModal = dynamic(() => import('src/components/Home/Cart/CartModal'));

interface Props {
  user: any;
  counter: number;
  open: boolean;
  changeOpen: (v: boolean) => void;
  accountOpen: boolean;
  setAccountOpen: (v: boolean) => void;
  onLogout: () => void;
  isAdmin: boolean;
}

export function NavIconsView({
  user,
  counter,
  open,
  changeOpen,
  accountOpen,
  setAccountOpen,
  onLogout,
  isAdmin,
}: Props) {
  if (!user) return <GuestAuthButtons />;

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {/* 오버레이(계정 메뉴 외부 클릭) */}
      <div
        className={`z-10 fixed w-full h-screen top-0 left-0 ${!accountOpen && 'hidden'}`}
        onClick={() => setAccountOpen(false)}
      />
      <Image
        src="/images/mall/profile.png"
        alt="profile"
        width={22}
        height={22}
        className="cursor-pointer"
        aria-label="my-menu"
        onClick={() => setAccountOpen(!accountOpen)}
      />

      {accountOpen && (
        <div
          id="account-menu"
          className="absolute animate-fadeInUp p-4 rounded-md top-12 left-0 bg-white text-sm shadow-[0_3px_10px_rgb(0,0,0,0.2)] z-20"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <Link href="/shopping">
              <div className="cursor-pointer">나의쇼핑</div>
            </Link>
            <Link href="/review">
              <div className="mt-2 cursor-pointer">나의리뷰</div>
            </Link>
            <div className="mt-2 cursor-pointer">
              <button onClick={onLogout} aria-label="logout">
                로그아웃
              </button>
            </div>
          </div>
        </div>
      )}

      {isAdmin && (
        <Link href="/admin/products">
          <BuildingStorefrontIcon className="h-7 w-7 cursor-pointer" strokeWidth={1} />
        </Link>
      )}

      <Image
        src="/images/mall/notification.png"
        alt="알림"
        width={22}
        height={22}
        className="cursor-pointer"
      />

      <div className="relative cursor-pointer" onClick={() => changeOpen(!open)}>
        <Image src="/images/mall/cart.png" alt="장바구니" width={22} height={22} />
        <div className="absolute -top-4 -right-4 w-6 h-6 bg-ecom rounded-full text-white text-sm flex items-center justify-center">
          {counter}
        </div>
      </div>

      <CartModal />
    </div>
  );
}
