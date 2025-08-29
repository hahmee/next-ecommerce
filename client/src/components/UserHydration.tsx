'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { Member } from '@/interface/Member';

// UserHydration (SSR → CSR 전달)
// zustand에 user 정보 넣는다.
export const UserHydration = ({ user }: { user: Member }) => {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    if (user) setUser(user);
  }, [user]);

  return null;
};
