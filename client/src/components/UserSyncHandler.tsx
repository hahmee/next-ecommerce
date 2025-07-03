'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;

// CSR에서 자동 재요청 + refresh 처리
export default function UserSyncHandler() {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    const sync = async () => {
      try {
        console.log('refresh 요청')
        // 1. /refresh 요청
        const refreshRes = await fetch(`${BACKEND_URL}/api/member/refresh`, {
          method: 'POST',
          credentials: 'include', // 쿠키 전송
        });

        if (!refreshRes.ok) {
          console.log('❌ refresh 실패');
          return;
        }

        // 2. 토큰 재발급 성공 → /me 재요청
        const res = await fetch('/api/me', {
          credentials: 'include',
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message);

        // 3. 상태 저장
        setUser(data.data);
        console.log('user 복구 완료');
      } catch (e) {
        console.log('User 복구 실패:', e);
        toast.error('로그인 정보를 불러오지 못했습니다.');
      }
    };

    sync();
  }, []);

  return null;
}
