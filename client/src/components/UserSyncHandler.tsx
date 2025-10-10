'use client';

import {useEffect} from 'react';
import {useQueryClient} from '@tanstack/react-query';
import {useUserStore} from '@/store/userStore';
import {authApi} from '@/libs/services/authApi';

// 새로고침하거나 CSR로 진입했을 때 로그인 상태를 복원해주는 역할
// 새로고침 등 최초 마운트 1회만 실행
export default function UserSyncHandler() {
  const qc = useQueryClient();
  const { setUser, resetUser, setSessionExpired } = useUserStore();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const user = await qc.fetchQuery({
          queryKey: ['me-sync'],
          queryFn: () => authApi.me(),
        });
        if (mounted) setUser(user);
      } catch (_error) {
        // 전역 onError가 처리
      }
    })();

    return () => {
      mounted = false;
    };
  }, [qc, setUser]);

  return null;
}
