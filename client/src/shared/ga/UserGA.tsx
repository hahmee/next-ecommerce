'use client';

import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';
import crypto from 'crypto';
import React, { useEffect, useState } from 'react';

import { useUserStore } from '@/shared/store/userStore';

const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_GA_TRACKING_ID;
const GTM_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_GTM_TRACKING_ID;

// User-ID 암호화 함수
function hashUserId(userId: string): string {
  return crypto.createHash('sha256').update(userId).digest('hex');
}

const UserGA = () => {
  const { user } = useUserStore();

  const [hashedUserId, setHashedUserId] = useState('');

  useEffect(() => {
    if (user) {
      const { email } = user;

      const encryptedId = hashUserId(email);
      setHashedUserId(encryptedId);
    }
  }, [user]);

  if (!hashedUserId || !GTM_TRACKING_ID || !GA_TRACKING_ID) return null;

  return (
    <>
      <GoogleTagManager gtmId={GTM_TRACKING_ID} />
      <GoogleAnalytics gaId={GA_TRACKING_ID} />
    </>
  );
};

export default UserGA;
