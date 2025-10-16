'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

import RQProvider from '@/shared/ui/RQProvider';
import SessionExpiredRedirect from '@/shared/ui/SessionExpiredRedirect';
import UserSyncHandler from '@/shared/ui/UserSyncHandler';
import { GAPageView } from '@/widgets/layout/ga/GAPageView';

type Props = {
  children: React.ReactNode;
  hasRefreshToken: boolean;
  gaTrackingId?: string;
};

export default function AppProviders({ children, hasRefreshToken, gaTrackingId }: Props) {
  return (
    <>
      <RQProvider>
        <div id="portal-root" />
        <SessionExpiredRedirect />
        {hasRefreshToken && <UserSyncHandler />}
        {children}
        <Toaster />
      </RQProvider>

      {/* 페이지뷰 트래킹 (클라이언트) */}
      <GAPageView />

      {/* @next/third-parties/google 의 GA는 서버/클라이언트 모두 가능하지만,
          여기선 루트 레이아웃에서 삽입되므로 서버에서 넣고, 필요하면 아래처럼 대체 가능 */}
      {/* gaTrackingId && <SomeClientSideGA gaId={gaTrackingId} /> */}
    </>
  );
}
