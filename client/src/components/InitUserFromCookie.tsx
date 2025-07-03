'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { getUserInfo } from '@/libs/auth';
import {fetcher} from "@/utils/fetcher";

// 새로고침시 zustand user 날라가는거 방지
export function InitUserFromCookie() {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    // fetcher()
  }, []);

  return null;
}
