'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import { getUserInfo } from '@/libs/auth';
import {fetcher} from "@/utils/fetcher/fetcher";

// 새로고침시 zustand user 날라가는거 방지
export function InitUserFromCookie() {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    // fetcher()
    fetch("/api/me") // → 실패하면 /refresh 후 재시도
      .then(...)
      .then(user => setUser(user))
  }, []);

  return null;
}
