'use client';

// import { useEffect } from 'react';
// import { useUserStore } from '@/store/userStore';
// import toast from 'react-hot-toast';
//
// const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL!;
//
// //새로고침 등 최초 마운트 1회만 실행
// //그래서 CSR 중간에 accessToken이 만료되면 fetcher가 대신 복구해줘야 한다.
// //CSR 마운트 시 refresh → /me 재요청 흐름
// export default function UserSyncHandler() {
//   const setUser = useUserStore((s) => s.setUser);
//
//   useEffect(() => {
//     console.log('[UserSyncHandler] 마운트됨');
//     const sync = async () => {
//       try {
//         console.log('[UserSync] /api/me 요청');
//         let res = await fetch('/api/me', { credentials: 'include' });
//
//         // 401 → /refresh → /me 재요청
//         if (res.status === 401) {
//           console.log('[UserSync] accessToken 만료 → refresh 시도');
//
//           const refreshRes = await fetch(`${BACKEND_URL}/api/member/refresh`, {
//             method: 'POST',
//             credentials: 'include',
//           });
//
//           if (!refreshRes.ok) {
//             console.warn('[UserSync] refresh 실패');
//             return;
//           }
//
//           console.log('[UserSync] refresh 성공 → /api/me 재요청');
//           res = await fetch('/api/me', { credentials: 'include' });
//         }
//
//         const json = await res.json();
//
//         if (!res.ok || !json.success) throw new Error(json.message || 'user fetch 실패');
//
//         setUser(json.data);
//         console.log('[UserSync] user 복구 완료');
//       } catch (e) {
//         console.error('User 복구 실패:', e);
//         toast.error('로그인 정보를 불러오지 못했습니다.');
//       }
//     };
//
//     sync();
//   }, []);
//
//   return null;
// }
//


'use client';

import { useEffect } from 'react';
import { useUserStore } from '@/store/userStore';
import toast from 'react-hot-toast';
import { fetcher } from '@/utils/fetcher';

export default function UserSyncHandler() {
  const setUser = useUserStore((s) => s.setUser);

  useEffect(() => {
    console.log('[UserSyncHandler] 마운트됨');
    const sync = async () => {
      try {
        const user = await fetcher("/api/me", { // 백엔드에서 accessToken이 없다고 나옴
          credentials: 'include', // 자동 쿠키 전송
        }); // 401 → refresh → 재시도는 fetcher가 자동 처리
        setUser(user);
        console.log('[UserSync] user 복구 완료');
      } catch (e: any) {
        console.error('[UserSync] 사용자 정보 복구 실패:', e);
        toast.error(e?.message || '로그인 정보를 불러오지 못했습니다.');
      }
    };

    sync();
  }, []);

  return null;
}