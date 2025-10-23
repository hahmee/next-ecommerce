'use client';

import { sendGAEvent } from '@next/third-parties/google';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export function useGAPageView() {
  const pathname = usePathname(); // 현재 페이지 경로를 가져온다.

  useEffect(() => {
    const timeout = setTimeout(() => {
      sendGAEvent('page_view', { page_path: pathname }); // 페이지 경로가 변경될 때마다 페이지뷰 이벤트를 전송한다.
    }, 500); // 500ms 뒤에 실행 (tbt 개선)
    return () => clearTimeout(timeout);
  }, [pathname]);

  return null;
}

export const GAPageView = () => {
  useGAPageView(); // useGAPageView 훅을 호출하여 페이지뷰 이벤트를 전송한다.
  return null;
};
