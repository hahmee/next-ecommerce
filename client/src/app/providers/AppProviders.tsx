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
    </>
  );
}
