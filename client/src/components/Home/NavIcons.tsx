"use client";
import Image from "next/image";
import Link from "next/link";
import React, {useEffect, useState} from "react";
import {Member} from "@/interface/Member";
import {useCartStore} from "@/store/cartStore";
import {getCart, logout} from "@/apis/mallAPI";
import {useRouter} from "next/navigation";
import {BuildingStorefrontIcon} from "@heroicons/react/24/outline";
import {MemberRole} from "@/types/memberRole";
import {useQuery} from "@tanstack/react-query";
import {CartItemList} from "@/interface/CartItemList";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import {useUserStore} from "@/store/userStore";
import GuestAuthButtons from "@/components/Home/GuestAuthButtons";

const CartModal = dynamic(() => import('../Home/Cart/CartModal'))

// const NavIcons = ({memberInfo}: {memberInfo: Member}) => {
const NavIcons = () => {

  const router = useRouter();
  const {user, resetUser} = useUserStore();
  const {counter, changeOpen, open , setCarts} = useCartStore();
  const [accountOpen, setAccountOpen] = useState(false);
  console.log('user', user);
  const onLogout = async () => {

        // queryClient.invalidateQueries({
        //     queryKey: ["users"],
        // });

        await logout();
        resetUser();

        router.push('/login');
        toast.success("로그아웃 되었습니다.");
    };

    const { isFetched, isFetching, data:cartData, error, isError} = useQuery<Array<CartItemList>, Object, Array<CartItemList>>({
        queryKey: ['carts'],
        queryFn: () => getCart(),
        staleTime: 60 * 1000, // 1분동안 fresh
        gcTime: 300 * 1000, // 가비지 컬렉션 시간
        throwOnError: true,
        enabled: !!user,
    });

    // React Query 데이터와 Zustand 동기화
    useEffect(() => {
        if (cartData) {
            setCarts(cartData); // Zustand의 상태 업데이트
        }
    }, [cartData, setCarts]);

    if(!user) {
      return <GuestAuthButtons />
    }

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      {/*모달 바깥 클릭 */}
      <div className={`z-10 fixed w-full overflow-hidden h-screen top-0 left-0 ${!accountOpen && "hidden"}`}
           onClick={() => setAccountOpen(false)}></div>
      <Image
        src="/images/mall/profile.png"
        alt="profile"
        width={22}
        height={22}
        className="cursor-pointer"
        aria-label={"my-menu"}
        onClick={() => setAccountOpen((prev) => !prev)}
      />
      {
        accountOpen && (
          <div
            id="account-menu"
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
                <button onClick={onLogout} aria-label={"logout"}>로그아웃</button>
              </div>
            </div>
          </div>
        )
      }

      {user?.roleNames?.some(role => [MemberRole.ADMIN, MemberRole.MANAGER, MemberRole.DEMO].includes(role)) && (
        <Link href="/admin/products">
          <BuildingStorefrontIcon className="h-7 w-7 cursor-pointer" strokeWidth={1}/>
        </Link>
      )}

      <Image
        src="/images/mall/notification.png"
        alt=""
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div
        className="relative cursor-pointer"
        onClick={() => changeOpen(!open)}
      >
        <Image src="/images/mall/cart.png" alt="" width={22} height={22}/>
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
