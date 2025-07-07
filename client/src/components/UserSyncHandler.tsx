'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';
import { fetcher } from '@/utils/fetcher/fetcher';
import {useRouter} from "next/navigation";
import {logout} from "@/apis/mallAPI";
import {SessionExpiredError} from "@/libs/error/errors";

//새로고침 등 최초 마운트 1회만 실행
//그래서 CSR 중간에 accessToken이 만료되면 fetcher가 대신 복구해줘야 한다.
//CSR 마운트 시 refresh → /me 재요청 흐름
export default function UserSyncHandler() {
  const setUser = useUserStore((s) => s.setUser);
  const router = useRouter();
  const {resetUser} = useUserStore();

  useEffect(() => {

    console.log('[UserSyncHandler] 마운트됨');

    const sync = async () => {
      try {
        const user = await fetcher("/api/me", {
          credentials: 'include', // 자동 쿠키 전송
        }); // 401 → refresh → 재시도는 fetcher가 자동 처리
        setUser(user);
        console.log('[UserSync] user 복구 완료');
      } catch (error: any) {
        if (error instanceof SessionExpiredError) {
          console.log('[UserSyncHandler] 세션 만료 → /login 리다이렉트');

          try {
            await logout(); // 실패해도 그 다음 로직 실행
          } catch (logoutErr) {
            console.error('백엔드 로그아웃 실패:', logoutErr);
          }

          resetUser();
          router.replace('/login');

        } else {
          toast.error(error.message || '사용자 정보 복구 실패');
        }

      }
    };

    sync();
  }, []);

  return null;
};