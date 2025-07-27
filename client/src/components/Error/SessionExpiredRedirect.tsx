// components/Error/SessionExpiredRedirect.tsx
"use client";

import {useEffect} from "react";
import {useRouter} from "next/navigation";
import {useUserStore} from "@/store/userStore";
import {logout} from "@/apis/mallAPI"; // Zustand store

const SessionExpiredRedirect = () => {
  const router = useRouter();
  const { isSessionExpired, clearSessionExpired, resetUser } = useUserStore();
  useEffect(() => {
    if (!isSessionExpired) return; // refreshToken까지 만료

    const cleanUpSession = async () => {
      console.warn("🔒 세션 만료 → 자동 로그아웃 처리 시작");

      try {
        await logout(); // 백엔드에 refreshToken 제거 요청
      } catch (e) {
        console.error("❗ 백엔드 로그아웃 실패", e);
      }

      // 상태 초기화
      resetUser();
      clearSessionExpired();

      // 로그인 페이지로 이동
      router.replace("/login");
    };

    cleanUpSession();
  }, [isSessionExpired, router]);

  return null;
};

export default SessionExpiredRedirect;
