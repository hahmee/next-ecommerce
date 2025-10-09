'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import type { CartItemList } from '@/interface/CartItemList';
import { useUserStore } from '@/store/userStore';
import { useCartStore } from '@/store/cartStore';
import { MemberRole } from '@/types/memberRole';
import {cartApi} from "@/libs/services/cartApi";
import {authApi} from "@/libs/services/authApi";

export function useNavIcons() {
  const router = useRouter();
  const { user, resetUser } = useUserStore();
  const { counter, changeOpen, open, setCarts } = useCartStore();
  const [accountOpen, setAccountOpen] = useState(false);

  const { data: cartData } = useQuery<CartItemList[]>({
    queryKey: ['carts'],
    queryFn: () => cartApi.list(),
    staleTime: 60_000,
    gcTime: 300_000,
    throwOnError: true,
    enabled: !!user,
  });

  useEffect(() => {
    if (cartData) setCarts(cartData);
  }, [cartData, setCarts]);

  const onLogout = async () => {
    await authApi.logout();
    resetUser();
    router.push('/login');
    router.refresh();
    toast.success('로그아웃 되었습니다.');
  };

  const isAdmin =
    !!user?.roleNames?.some((r) =>
      [MemberRole.ADMIN, MemberRole.MANAGER, MemberRole.DEMO].includes(r),
    );

  return {
    user,
    counter,
    open,
    changeOpen,
    accountOpen,
    setAccountOpen,
    onLogout,
    isAdmin,
  } as const;
}
