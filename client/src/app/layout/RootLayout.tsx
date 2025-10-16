import { GoogleAnalytics } from '@next/third-parties/google';
import { cookies } from 'next/headers';
import React from 'react';

import { inter } from '@/app/layout/fonts';
import AppProviders from '@/app/providers/AppProviders';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_TRACKING_ID;

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refresh_token')?.value;

  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning>
        <AppProviders
          hasRefreshToken={Boolean(refreshToken)}
          gaTrackingId={GA_TRACKING_ID ?? undefined}
        >
          {children}
        </AppProviders>

        {GA_TRACKING_ID && <GoogleAnalytics gaId={GA_TRACKING_ID} />}
      </body>
    </html>
  );
}
