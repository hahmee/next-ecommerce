'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';

import { authApi } from '@/libs/services/authApi';
import { useUserStore } from '@/store/userStore';

// SessionExpiredError 발생 시 setSessionExpired 플래그를 감지
// 상태 정리 + 리다이렉트만 수행
const SessionExpiredRedirect = () => {
  const router = useRouter();
  const { isSessionExpired, clearSessionExpired, resetUser } = useUserStore();
  const running = useRef(false); // 중복 실행 방지

  useEffect(() => {
    if (!isSessionExpired || running.current) return;
    running.current = true;

    const cleanUpSession = async () => {
      console.warn('세션 만료 → 자동 로그아웃 처리 시작');

      try {
        await authApi.logout();
      } catch (e) {
        console.error('백엔드 로그아웃 실패(무시 가능):', e);
      } finally {
        // 클라이언트 상태 초기화
        resetUser();
        clearSessionExpired();
        router.replace('/login');
        router.refresh(); // SSR에서 cookies() 읽는 곳 최신화
      }
    };

    cleanUpSession();
  }, [isSessionExpired, clearSessionExpired, resetUser, router]);

  return null;
};

export default SessionExpiredRedirect;
