// src/widgets/layout/model/useNavIcons.ts

// src/widgets/layout/model/useNavIcons.ts

'use client';

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { cartApi } from '@/entities/cart/api/cartApi';
import type { CartItemList } from '@/entities/cart/model/CartItemList';
import { authApi } from '@/entities/member/api/authApi';
import { MemberRole } from '@/entities/member/consts/MemberRole';
import { useCartStore } from '@/shared/store/cartStore';
import { useUserStore } from '@/shared/store/userStore';

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
    throwOnError: false,
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

  const isAdmin = !!user?.roleNames?.some((r) =>
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
