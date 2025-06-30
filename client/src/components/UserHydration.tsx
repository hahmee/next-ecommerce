'use client';
import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import {Member} from "@/interface/Member";

export function UserHydration({ user }: { user: Member }) {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    console.log('user', user)
    if (user) setUser(user);
  }, [user]);

  return null;
}

