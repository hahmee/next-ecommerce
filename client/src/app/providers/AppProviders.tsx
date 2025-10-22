// src/app/providers/AppProviders.tsx

'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';

import RQProvider from '@/app/providers/RQProvider';
import SessionExpiredRedirect from '@/shared/ui/SessionExpiredRedirect';
import UserSyncHandler from '@/shared/ui/UserSyncHandler';

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
