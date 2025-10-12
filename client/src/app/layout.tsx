import './globals.css';

import { GoogleAnalytics } from '@next/third-parties/google';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from 'next/headers';
import React from 'react';
import { Toaster } from 'react-hot-toast';

import RQProvider from '@/features/common/model/RQProvider';
import SessionExpiredRedirect from '@/features/common/model/SessionExpiredRedirect';
import UserSyncHandler from '@/features/common/model/UserSyncHandler';
import { GAPageView } from '@/features/common/ga/GAPageView';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_TRACKING_ID;

const inter = Inter({ subsets: ['latin'], adjustFontFallback: false });

export const metadata: Metadata = {
  title: 'E-Commerce Application',
  description: 'A e-commerce application with Next.js',
  icons: {
    icon: '/images/main/logo.svg', // ?��? 경로�??�정
  },
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? '',
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <RQProvider>
          <div id="portal-root" />
          <SessionExpiredRedirect />
          {refreshToken && <UserSyncHandler />}
          {children}
          <Toaster />
        </RQProvider>

        {GA_TRACKING_ID && (
          <>
            {/* ??�??�시???��? 말것 */}
            {/* <GoogleTagManager gtmId={GTM_TRACKING_ID}/> */}
            <GoogleAnalytics gaId={GA_TRACKING_ID} />
          </>
        )}
        <GAPageView />
      </body>
    </html>
  );
}
