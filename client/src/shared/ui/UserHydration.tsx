'use client';

import { useEffect } from 'react';

import { Member } from '@/entities/member/model/Member';
import { useUserStore } from '@/shared/store/userStore';

// UserHydration (SSR → CSR 전달)
// zustand에 user 정보 넣는다.
export const UserHydration = ({ user }: { user: Member }) => {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (user) setUser(user);
  }, [user]);

  return null;
};
