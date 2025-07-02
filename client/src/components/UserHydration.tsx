'use client';
import {useEffect} from 'react';
import {useUserStore} from '@/store/userStore';
import {Member} from "@/interface/Member";

export function UserHydration({ user }: { user: Member }) {
  const setUser = useUserStore((s) => s.setUser);
  useEffect(() => {
    console.log('user', user)
    if (user) setUser(user);
  }, [user]);
  //
  // useEffect(() => {
  //   console.log('user',user)
  //
  //   if (!user) {
  //     toast.error("로그인 정보를 불러올 수 없습니다.");
  //   }
  // }, []);

  return null;
}

