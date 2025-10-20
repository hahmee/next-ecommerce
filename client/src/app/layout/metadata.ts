// src/app/layout/metadata.ts

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'E-Commerce Application',
  description: 'A e-commerce application with Next.js',
  icons: {
    icon: '/images/main/logo.svg',
  },
  other: {
    'google-site-verification': process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ?? '',
  },
};
